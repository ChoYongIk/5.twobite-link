import type { Metadata } from "next";
import { FoldersProvider } from "@/components/folders-provider";
import { LinksProvider } from "@/components/links-provider";
import { getFolders } from "./lib/get-folders";
import { getLinks } from "./lib/get-links";
import "./globals.css";

export const metadata: Metadata = {
  title: "한입 링크",
  description: "한 입에 담는 북마크, 폴더로 정리하는 링크 서비스",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // 두 조회는 서로 의존하지 않으므로 같이 기다립니다.
  const [folders, links] = await Promise.all([getFolders(), getLinks()]);

  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col">
        <FoldersProvider initialFolders={folders}>
          <LinksProvider initialLinks={links}>{children}</LinksProvider>
        </FoldersProvider>
      </body>
    </html>
  );
}
