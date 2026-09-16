import type { Metadata } from "next";
import { FoldersProvider } from "@/components/folders-provider";
import { LinksProvider } from "@/components/links-provider";
import { getFolders } from "./lib/get-folders";
import { getLinks } from "./lib/get-links";
import { getUserId } from "./lib/get-user-id";
import {
  getMetadataBase,
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "./lib/metadata";
import "./globals.css";

/**
 * 사이트 공통 메타 태그. 파비콘은 app/favicon.ico 파일 규칙으로 자동 연결됩니다.
 * 페이지가 title만 정하면 "제목 | 한입 링크" 형태가 되고, openGraph를 정하지 않으면 여기 값이 그대로 쓰입니다.
 */
export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    // 제목·설명·이미지는 페이지별 openGraph에서 자동으로 채워집니다.
    card: "summary_large_image",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // 세 조회는 서로 의존하지 않으므로 같이 기다립니다. 사용자 id는 React cache로 한 번만 읽습니다.
  const [userId, folders, links] = await Promise.all([
    getUserId(),
    getFolders(),
    getLinks(),
  ]);

  // 로그인 사용자가 바뀌면 key가 달라져 Provider가 새로 마운트되고,
  // 이전 계정의 링크·폴더 상태를 버리고 서버가 내려준 데이터로 처음부터 다시 채웁니다.
  const accountKey = userId ?? "guest";

  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col">
        <FoldersProvider key={accountKey} initialFolders={folders}>
          <LinksProvider key={accountKey} initialLinks={links}>
            {children}
          </LinksProvider>
        </FoldersProvider>
      </body>
    </html>
  );
}
