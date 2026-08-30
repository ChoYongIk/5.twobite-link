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
      <div className="mb-12 flex items-center gap-3">
        {icon ? (
          <span className="text-[32px] leading-none" aria-hidden>
            {icon}
          </span>
        ) : null}
        <h1 className="text-[40px] leading-[1.1] font-semibold tracking-[-0.5px] text-[var(--text)]">
          {title}
        </h1>
        <span className="badge shrink-0 self-center px-3 py-1 text-[13px] leading-[1.4] tabular-nums">
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
