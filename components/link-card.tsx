import { ArrowUpRightIcon, PencilIcon, TrashIcon } from "./icons";
import type { LinkItem } from "@/app/lib/types";

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

type LinkCardProps = {
  link: LinkItem;
  /** 둘 다 넘기면 마우스를 올렸을 때 우측 상단에 수정·삭제 버튼이 나타납니다. */
  onEdit?: () => void;
  onDelete?: () => void;
};

export function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  const host = hostnameOf(link.url);
  const hasActions = Boolean(onEdit && onDelete);

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
        <ArrowUpRightIcon
          className={`${hasActions ? "card-arrow " : ""}mt-0.5 size-4 shrink-0 text-[var(--placeholder)]`}
        />
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

      {/* 제목 링크가 카드 전체를 덮고 있어, 그 위로 올라오도록 z-10을 줍니다. */}
      {hasActions ? (
        <div className="card-actions absolute top-4 right-4 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`${link.title} 링크 수정`}
            className="card-action flex size-8 items-center justify-center rounded-full outline-none"
          >
            <PencilIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`${link.title} 링크 삭제`}
            className="card-action card-action-danger flex size-8 items-center justify-center rounded-full outline-none"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      ) : null}
    </article>
  );
}
