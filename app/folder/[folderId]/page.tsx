import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkSection } from "@/components/link-section";
import { PageShell } from "@/components/page-shell";
import { Workspace } from "@/components/workspace";
import { folders, links } from "@/app/lib/mock-data";

export function generateStaticParams() {
  return folders.map((folder) => ({ folderId: folder.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/folder/[folderId]">): Promise<Metadata> {
  const { folderId } = await params;
  const folder = folders.find((item) => item.id === folderId);

  if (!folder) {
    return { title: "폴더를 찾을 수 없어요 | 한입 링크" };
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
  const folder = folders.find((item) => item.id === folderId);

  if (!folder) {
    notFound();
  }

  const folderLinks = links.filter((link) => link.folderId === folder.id);

  return (
    <PageShell>
      <Workspace folders={folders} links={links}>
        <LinkSection
          title={folder.name}
          icon={folder.emoji}
          links={folderLinks}
        />
      </Workspace>
    </PageShell>
  );
}
