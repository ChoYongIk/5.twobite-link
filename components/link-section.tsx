import type { ReactNode } from "react";
import { EmptyState } from "./empty-state";
import { LinkGrid } from "./link-grid";
import type { LinkItem } from "@/app/lib/types";

type LinkSectionProps = {
  title: string;
  icon?: ReactNode;
  links: LinkItem[];
};

/** 제목과 개수를 얹은 링크 그리드. 비어 있으면 안내 화면을 보여줍니다. */
export function LinkSection({ title, icon, links }: LinkSectionProps) {
  return (
    <>
      <div className="mb-5 flex items-baseline gap-2">
        {icon ? (
          <span className="text-lg leading-none" aria-hidden>
            {icon}
          </span>
        ) : null}
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        <span className="text-sm tabular-nums text-zinc-400 dark:text-zinc-600">
          {links.length}
        </span>
      </div>

      {links.length > 0 ? (
        <LinkGrid links={links} />
      ) : (
        <EmptyState folderName={title} />
      )}
    </>
  );
}
