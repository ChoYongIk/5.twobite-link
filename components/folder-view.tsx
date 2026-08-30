"use client";

import { FolderMissing } from "./folder-missing";
import { useFolders } from "./folders-provider";
import { LinkSection } from "./link-section";
import { useLinks } from "./links-provider";

/**
 * 폴더와 링크는 화면에서 추가될 수 있어 서버가 목록을 다 알지 못합니다.
 * 그래서 이름·이모지와 링크를 모두 Provider가 들고 있는 목록에서 찾습니다.
 */
export function FolderView({ folderId }: { folderId: string }) {
  const { folders } = useFolders();
  const { links } = useLinks();
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
