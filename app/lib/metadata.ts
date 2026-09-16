import type { Metadata } from "next";

export const SITE_NAME = "한입 링크";
export const SITE_DESCRIPTION =
  "한 입에 담는 북마크, 폴더로 정리하는 링크 서비스";

/**
 * 소셜 미리보기(오픈그래프·트위터 카드)에 쓰는 썸네일. public/thumbnail.png (2400×1260)를
 * metadataBase 기준 절대 주소로 바꿔 넣습니다.
 */
export const OG_IMAGE = {
  url: "/thumbnail.png",
  width: 2400,
  height: 1260,
  alt: `${SITE_NAME} 미리보기`,
};

/**
 * 배포 주소. og:url·og:image 같은 절대 주소를 만드는 기준입니다.
 * 1) NEXT_PUBLIC_SITE_URL (직접 지정)  2) Vercel 프로덕션 도메인  3) 개발용 localhost 순으로 고릅니다.
 */
export function getMetadataBase(): URL {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return new URL(candidate);
    } catch {
      // 잘못된 값은 건너뛰고 다음 후보를 봅니다.
    }
  }

  return new URL(`http://localhost:${process.env.PORT ?? 3000}`);
}

type PageMetadataInput = {
  /** 페이지 제목. "| 한입 링크"는 루트 레이아웃의 템플릿이 붙입니다. */
  title: string;
  description: string;
  /** 사이트 안 경로. og:url 계산에 씁니다. */
  path: string;
};

/**
 * 페이지마다 제목·설명·주소가 다른 오픈그래프 태그를 만듭니다.
 * openGraph는 레이아웃 값과 병합되지 않고 통째로 바뀌므로 이미지·사이트명은 여기서 매번 채웁니다.
 * 트위터 카드는 Next.js가 openGraph에서 자동으로 채우고, 카드 종류만 레이아웃에서 정합니다.
 */
export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
      images: [OG_IMAGE],
    },
  };
}
