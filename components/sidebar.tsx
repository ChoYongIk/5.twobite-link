"use client";

import { usePathname } from "next/navigation";
import { InboxIcon } from "./icons";
import { SidebarItem } from "./sidebar-item";
import type { Folder, LinkItem } from "@/app/lib/types";

type SidebarProps = {
  folders: Folder[];
  /** 폴더별 링크 개수를 세는 데 사용합니다. */
  links: LinkItem[];
};

export function Sidebar({ folders, links }: SidebarProps) {
  const pathname = usePathname();

  const countOf = (folderId: string) =>
    links.filter((link) => link.folderId === folderId).length;

  return (
    <aside className="w-full shrink-0 md:sticky md:top-20 md:w-56 md:self-start">
      <nav
        aria-label="폴더"
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0"
      >
        <div className="w-40 shrink-0 md:w-auto">
          <SidebarItem
            icon={<InboxIcon className="size-4.5" />}
            label="All"
            count={links.length}
            href="/"
            active={pathname === "/"}
          />
        </div>

        <p className="mt-5 mb-1 hidden px-3 text-xs font-medium tracking-wide text-zinc-400 uppercase md:block dark:text-zinc-600">
          폴더
        </p>

        {folders.map((folder) => {
          const href = `/folder/${folder.id}` as const;

          return (
            <div key={folder.id} className="w-40 shrink-0 md:w-auto">
              <SidebarItem
                icon={folder.emoji}
                label={folder.name}
                count={countOf(folder.id)}
                href={href}
                active={pathname === href}
              />
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
