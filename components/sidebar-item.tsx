import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { PencilIcon, TrashIcon } from "./icons";

type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  count: number;
  href: ComponentProps<typeof Link>["href"];
  active: boolean;
  /** 둘 다 넘기면 마우스를 올렸을 때 개수 자리에 수정·삭제 버튼이 나타납니다. */
  onEdit?: () => void;
  onDelete?: () => void;
};

export function SidebarItem({
  icon,
  label,
  count,
  href,
  active,
  onEdit,
  onDelete,
}: SidebarItemProps) {
  const hasActions = Boolean(onEdit && onDelete);

  return (
    <div className="folder-row relative">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="nav-item flex w-full shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] leading-[1.4] outline-none"
      >
        <span className="flex size-4 shrink-0 items-center justify-center text-[13px] leading-none">
          {icon}
        </span>
        <span className="flex-1 truncate text-left">{label}</span>
        <span
          className={`${hasActions ? "folder-count " : ""}shrink-0 text-[13px] tabular-nums text-[var(--text-sub)]`}
        >
          {count}
        </span>
      </Link>

      {/* 링크 안에는 버튼을 넣을 수 없어 개수 위에 겹쳐 놓습니다. */}
      {hasActions ? (
        <div className="folder-actions absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5 rounded">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`${label} 폴더 이름 수정`}
            className="folder-action flex size-5 items-center justify-center rounded outline-none"
          >
            <PencilIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`${label} 폴더 삭제`}
            className="folder-action folder-action-danger flex size-5 items-center justify-center rounded outline-none"
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
