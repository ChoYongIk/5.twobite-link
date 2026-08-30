"use client";

import { FolderMissing } from "./folder-missing";
import { useFolders } from "./folders-provider";
import { LinkSection } from "./link-section";
import type { LinkItem } from "@/app/lib/types";

type FolderViewProps = {
  folderId: string;
  /** 전체 링크. 이 중 해당 폴더의 것만 골라 보여줍니다. */
  links: LinkItem[];
};

/**
 * 폴더는 화면에서 추가될 수 있어 서버가 목록을 다 알지 못합니다.
 * 그래서 이름·이모지는 FoldersProvider가 들고 있는 목록에서 찾습니다.
 */
export function FolderView({ folderId, links }: FolderViewProps) {
  const { folders } = useFolders();
  const folder = folders.find((item) => item.id === folderId);

  if (!folder) {
    return <FolderMissing />;
  }

  return (
    <LinkSection
      title={folder.name}
      icon={folder.emoji}
      links={links.filter((link) => link.folderId === folder.id)}
    />
  );
}
