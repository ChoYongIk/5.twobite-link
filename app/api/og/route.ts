import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

// node:dns를 쓰므로 Node 런타임이 필요합니다.
export const runtime = "nodejs";

const FETCH_TIMEOUT_MS = 8_000;
const MAX_REDIRECTS = 3;
/** <head>만 있으면 되므로 앞부분만 읽고 연결을 끊습니다. */
const MAX_BYTES = 512 * 1024;

const USER_AGENT =
  "Mozilla/5.0 (compatible; TwobiteLinkBot/1.0; +https://github.com/twobite-link)";

export type OpenGraph = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
};

/** 사설망·루프백으로 요청이 새어 나가지 않게 막습니다(SSRF 방지). */
function isPrivateAddress(address: string) {
  const host = address.toLowerCase();

  if (host === "::1" || host === "::") {
    return true;
  }
  // IPv6 유니크 로컬(fc00::/7)과 링크 로컬(fe80::/10).
  if (/^f[cd]/.test(host) || host.startsWith("fe80")) {
    return true;
  }

  const parts = host.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) {
    return false;
  }

  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) || // 클라우드 메타데이터 주소 포함
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

async function isSafeUrl(target: URL) {
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return false;
  }

  const hostname = target.hostname.replace(/^\[|\]$/g, "");
  if (isIP(hostname)) {
    return !isPrivateAddress(hostname);
  }
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    return false;
  }

  try {
    const { address } = await lookup(hostname);
    return !isPrivateAddress(address);
  } catch {
    return false;
  }
}

/** </head>가 나오거나 상한에 닿을 때까지만 본문을 읽습니다. */
async function readHead(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) {
    return "";
  }

  const decoder = new TextDecoder();
  let html = "";
  let received = 0;

  try {
    while (received < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      received += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (/<\/head>/i.test(html)) {
        break;
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  return html;
}

type FetchedPage = {
  html: string;
  finalUrl: string;
  contentType: string;
};

/**
 * 리다이렉트를 직접 따라가며 매번 주소를 다시 검사합니다.
 * 자동 추적에 맡기면 리다이렉트로 사설망에 닿는 것을 막을 수 없습니다.
 */
async function fetchPage(startUrl: URL): Promise<FetchedPage | null> {
  let target = startUrl;

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    if (!(await isSafeUrl(target))) {
      return null;
    }

    const response = await fetch(target, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      await response.body?.cancel().catch(() => {});
      if (!location) {
        return null;
      }
      target = new URL(location, target);
      continue;
    }

    if (!response.ok) {
      await response.body?.cancel().catch(() => {});
      return null;
    }

    return {
      html: await readHead(response),
      finalUrl: target.toString(),
      contentType: response.headers.get("content-type") ?? "",
    };
  }

  return null;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value: string) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, body: string) => {
    if (!body.startsWith("#")) {
      return NAMED_ENTITIES[body.toLowerCase()] ?? whole;
    }

    const isHex = body[1] === "x" || body[1] === "X";
    const code = isHex ? parseInt(body.slice(2), 16) : Number(body.slice(1));
    return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : whole;
  });
}

/** 속성 값을 큰따옴표 / 작은따옴표 / 따옴표 없음 순으로 읽습니다. */
const PROPERTY_ATTR = /(?:^|\s)property\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;
const NAME_ATTR = /(?:^|\s)name\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;
const CONTENT_ATTR = /(?:^|\s)content\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;

function readAttribute(tag: string, pattern: RegExp) {
  const match = tag.match(pattern);
  if (!match) {
    return undefined;
  }

  const value = match[1] ?? match[2] ?? match[3] ?? "";
  return decodeEntities(value).trim() || undefined;
}

/** <meta>의 property/name을 키로, content를 값으로 모읍니다. */
function collectMeta(html: string) {
  const meta = new Map<string, string>();

  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const key =
      readAttribute(tag, PROPERTY_ATTR) ?? readAttribute(tag, NAME_ATTR);
    const content = readAttribute(tag, CONTENT_ATTR);
    if (key && content && !meta.has(key.toLowerCase())) {
      meta.set(key.toLowerCase(), content);
    }
  }

  return meta;
}

function readTitleTag(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeEntities(match[1]).trim() || undefined : undefined;
}

/** 상대 주소로 적힌 썸네일을 절대 주소로 바꿉니다. */
function toAbsoluteImage(image: string | undefined, baseUrl: string) {
  if (!image) {
    return undefined;
  }

  try {
    const resolved = new URL(image, baseUrl);
    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
      return undefined;
    }
    return resolved.toString();
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  let url: unknown;

  try {
    ({ url } = await request.json());
  } catch {
    return Response.json({ error: "요청 형식이 올바르지 않아요." }, { status: 400 });
  }

  if (typeof url !== "string" || !url.trim()) {
    return Response.json({ error: "링크 주소가 필요해요." }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(url.trim());
  } catch {
    return Response.json({ error: "주소 형식이 올바르지 않아요." }, { status: 400 });
  }

  let page: FetchedPage | null;
  try {
    page = await fetchPage(target);
  } catch {
    page = null;
  }

  if (!page) {
    return Response.json(
      { error: "페이지 정보를 가져오지 못했어요." },
      { status: 502 },
    );
  }

  // HTML이 아니면 읽을 메타 태그가 없으므로 주소만 돌려줍니다.
  if (!page.contentType.includes("html")) {
    return Response.json({ url: page.finalUrl } satisfies OpenGraph);
  }

  const meta = collectMeta(page.html);
  const openGraph: OpenGraph = {
    url: meta.get("og:url") ?? page.finalUrl,
    title: meta.get("og:title") ?? meta.get("twitter:title") ?? readTitleTag(page.html),
    description:
      meta.get("og:description") ??
      meta.get("twitter:description") ??
      meta.get("description"),
    image: toAbsoluteImage(
      meta.get("og:image") ?? meta.get("og:image:url") ?? meta.get("twitter:image"),
      page.finalUrl,
    ),
    siteName: meta.get("og:site_name"),
  };

  return Response.json(openGraph);
}
