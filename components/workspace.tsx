import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import type { LinkItem } from "@/app/lib/types";

type WorkspaceProps = {
  /** 사이드바의 폴더별 개수 표시에 사용합니다. 폴더 목록은 FoldersProvider가 갖고 있습니다. */
  links: LinkItem[];
  children: ReactNode;
};

/** 좌측 폴더 사이드바와 본문(최대 680px)을 나란히 놓는 2단 레이아웃. */
export function Workspace({ links, children }: WorkspaceProps) {
  return (
    <div className="mx-auto flex w-full max-w-[980px] flex-1 flex-col gap-12 px-6 pt-14 pb-24 md:flex-row md:gap-10">
      <Sidebar links={links} />
      <main className="min-w-0 max-w-[680px] flex-1">{children}</main>
    </div>
  );
}
