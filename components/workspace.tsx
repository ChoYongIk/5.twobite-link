import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import type { Folder, LinkItem } from "@/app/lib/types";

type WorkspaceProps = {
  folders: Folder[];
  /** 사이드바의 폴더별 개수 표시에 사용합니다. */
  links: LinkItem[];
  children: ReactNode;
};

/** 좌측 폴더 사이드바와 본문을 나란히 놓는 2단 레이아웃. */
export function Workspace({ folders, links, children }: WorkspaceProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-6 md:py-8">
      <Sidebar folders={folders} links={links} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
