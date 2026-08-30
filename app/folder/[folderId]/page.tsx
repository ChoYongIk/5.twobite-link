import type { Metadata } from "next";
import { FolderView } from "@/components/folder-view";
import { PageShell } from "@/components/page-shell";
import { Workspace } from "@/components/workspace";
import { folders } from "@/app/lib/mock-data";

export function generateStaticParams() {
  return folders.map((folder) => ({ folderId: folder.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/folder/[folderId]">): Promise<Metadata> {
  const { folderId } = await params;
  const folder = folders.find((item) => item.id === folderId);

  // 화면에서 추가한 폴더는 서버가 이름을 모르므로 중립적인 제목을 씁니다.
  if (!folder) {
    return { title: "폴더 | 한입 링크" };
  }

  return {
    title: `${folder.name} | 한입 링크`,
    description: `${folder.name} 폴더에 담아둔 링크 모음.`,
  };
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
