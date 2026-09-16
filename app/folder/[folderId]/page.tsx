import type { Metadata } from "next";
import { getFolders } from "@/app/lib/get-folders";
import { pageMetadata } from "@/app/lib/metadata";
import { FolderView } from "@/components/folder-view";
import { PageShell } from "@/components/page-shell";
import { Workspace } from "@/components/workspace";

/**
 * 폴더 이름을 제목으로 씁니다. getFolders는 React cache로 감싸져 있어
 * 루트 레이아웃과 같은 요청 안에서는 DB를 한 번만 읽습니다.
 */
export async function generateMetadata({
  params,
}: PageProps<"/folder/[folderId]">): Promise<Metadata> {
  const { folderId } = await params;
  const folders = await getFolders();
  const folder = folders.find((item) => item.id === folderId);
  const path = `/folder/${folderId}`;

  // 내 폴더가 아니거나 없는 폴더면 이름을 드러내지 않고 중립적인 제목을 씁니다.
  if (!folder) {
    return pageMetadata({
      title: "폴더",
      description: "폴더에 담아둔 링크 모음.",
      path,
    });
  }

  return pageMetadata({
    title: folder.name,
    description: `${folder.name} 폴더에 담아둔 링크 모음.`,
    path,
  });
}

export default async function FolderPage({
  params,
}: PageProps<"/folder/[folderId]">) {
  const { folderId } = await params;

  return (
    <PageShell>
      <Workspace>
        <FolderView folderId={folderId} />
      </Workspace>
    </PageShell>
  );
}
