import { ArrowUpRightIcon } from "./icons";
import type { LinkItem } from "@/app/lib/types";

const ACCENTS = [
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
];

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** 파비콘 대신 호스트명 기준으로 안정적인 배지 색을 고릅니다. */
function accentOf(host: string) {
  const sum = [...host].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ACCENTS[sum % ACCENTS.length];
}

export function LinkCard({ link }: { link: LinkItem }) {
  const host = hostnameOf(link.url);

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md focus-within:ring-2 focus-within:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700">
      <div className="flex items-start gap-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold uppercase ${accentOf(host)}`}
          aria-hidden
        >
          {host.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="outline-none after:absolute after:inset-0"
            >
              {link.title}
            </a>
          </h3>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-500">
            {host}
          </p>
        </div>
        <ArrowUpRightIcon className="size-4 shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-500 dark:text-zinc-700 dark:group-hover:text-zinc-400" />
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {link.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <ul className="flex min-w-0 flex-wrap gap-1.5">
          {link.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              #{tag}
            </li>
          ))}
        </ul>
        <time className="shrink-0 text-xs tabular-nums text-zinc-400 dark:text-zinc-600">
          {link.createdAt}
        </time>
      </div>
    </article>
  );
}
