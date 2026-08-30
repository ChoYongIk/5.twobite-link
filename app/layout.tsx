import type { Metadata } from "next";
import { FoldersProvider } from "@/components/folders-provider";
import { folders } from "./lib/mock-data";
import "./globals.css";

export const metadata: Metadata = {
  title: "한입 링크",
  description: "한 입에 담는 북마크, 폴더로 정리하는 링크 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col">
        <FoldersProvider initialFolders={folders}>{children}</FoldersProvider>
      </body>
    </html>
  );
}
