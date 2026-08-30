"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteFolderModal } from "./delete-folder-modal";
import { FolderNameModal } from "./folder-name-modal";
import { useFolders } from "./folders-provider";
import { InboxIcon } from "./icons";
import { useLinks } from "./links-provider";
import { SidebarItem } from "./sidebar-item";
import type { Folder } from "@/app/lib/types";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { folders, renameFolder, removeFolder } = useFolders();
  const { links } = useLinks();
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  const countOf = (folderId: string) =>
    links.filter((link) => link.folderId === folderId).length;

  const handleRename = (name: string) => {
    if (folderToEdit) {
      renameFolder(folderToEdit.id, name);
    }
    setFolderToEdit(null);
  };

  const handleConfirmDelete = (folder: Folder) => {
    removeFolder(folder.id);
    setFolderToDelete(null);

    // 보고 있던 폴더를 지웠다면 갈 곳이 없어지므로 전체 링크로 옮깁니다.
    if (pathname === `/folder/${folder.id}`) {
      router.push("/");
    }
  };

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
                onEdit={() => setFolderToEdit(folder)}
                onDelete={() => setFolderToDelete(folder)}
              />
            </div>
          );
        })}
      </nav>

      <FolderNameModal
        open={folderToEdit !== null}
        title="폴더 이름 수정"
        folder={folderToEdit}
        onClose={() => setFolderToEdit(null)}
        onSubmit={handleRename}
      />

      <DeleteFolderModal
        folder={folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </aside>
  );
}
