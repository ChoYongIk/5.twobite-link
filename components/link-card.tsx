import { ArrowUpRightIcon } from "./icons";
import type { LinkItem } from "@/app/lib/types";

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function LinkCard({ link }: { link: LinkItem }) {
  const host = hostnameOf(link.url);

  return (
    <article className="card group relative flex h-full flex-col p-6">
      {link.thumbnail ? (
        <div className="mb-5 overflow-hidden rounded-lg bg-[var(--fill)]">
          {/* 썸네일 도메인이 링크마다 달라, 호스트를 열어 두는 next/image 설정 대신 원본을 그대로 씁니다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={link.thumbnail}
            alt=""
            loading="lazy"
            className="aspect-video w-full object-cover"
          />
        </div>
      ) : null}

      <div className="flex items-start gap-3">
        <h3 className="min-w-0 flex-1 text-[17px] leading-[1.4] font-semibold tracking-[-0.2px] text-[var(--text)]">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-2 outline-none after:absolute after:inset-0 group-focus-within:underline"
          >
            {link.title}
          </a>
        </h3>
        <ArrowUpRightIcon className="mt-0.5 size-4 shrink-0 text-[var(--placeholder)]" />
      </div>

      <p className="mt-1 truncate text-[14px] leading-[1.4] text-[var(--text-sub)]">
        {host}
      </p>

      <p className="mt-4 line-clamp-2 flex-1 text-[14px] leading-[1.5] text-[var(--text-sub)]">
        {link.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <ul className="flex min-w-0 flex-wrap gap-1.5">
          {link.tags.map((tag) => (
            <li
              key={tag}
              className="badge px-3 py-1 text-[13px] leading-[1.4] whitespace-nowrap"
            >
              {tag}
            </li>
          ))}
        </ul>
        <time className="shrink-0 text-[13px] leading-[1.4] tabular-nums text-[var(--text-sub)]">
          {link.createdAt}
        </time>
      </div>
    </article>
  );
}
