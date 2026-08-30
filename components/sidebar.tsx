"use client";

import { usePathname } from "next/navigation";
import { useFolders } from "./folders-provider";
import { InboxIcon } from "./icons";
import { SidebarItem } from "./sidebar-item";
import type { LinkItem } from "@/app/lib/types";

type SidebarProps = {
  /** 폴더별 링크 개수를 세는 데 사용합니다. */
  links: LinkItem[];
};

export function Sidebar({ links }: SidebarProps) {
  const pathname = usePathname();
  const { folders } = useFolders();

  const countOf = (folderId: string) =>
    links.filter((link) => link.folderId === folderId).length;

  return (
    <aside className="w-full shrink-0 md:sticky md:top-[72px] md:w-[220px] md:self-start">
      <nav
        aria-label="폴더"
        className="-mx-2 flex gap-1 overflow-x-auto px-2 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0"
      >
        <div className="w-40 shrink-0 md:w-auto">
          <SidebarItem
            icon={<InboxIcon className="size-4" />}
            label="전체"
            count={links.length}
            href="/"
            active={pathname === "/"}
          />
        </div>

        <p className="mt-8 mb-2 hidden px-3 text-[13px] leading-[1.4] tracking-[0.02em] text-[var(--text-sub)] md:block">
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
