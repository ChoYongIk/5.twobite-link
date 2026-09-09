import type { LinkItem } from "./types";

/** links 테이블에서 화면이 쓰는 컬럼. */
export type LinkRow = {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  folder_id: number | null;
  created_at: string;
};

/** 목록 카드가 쓰는 "YYYY.MM.DD" 형식으로 맞춥니다. */
function formatDate(iso: string) {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}.${month}.${day}`;
}

/** DB 행을 화면 모델로 바꿉니다. id는 폴더와 마찬가지로 문자열로 둡니다. */
export function toLinkItem(row: LinkRow): LinkItem {
  return {
    id: String(row.id),
    title: row.title ?? row.url,
    description: row.description ?? "",
    url: row.url,
    folderId: row.folder_id === null ? "" : String(row.folder_id),
    // 태그는 아직 테이블에 없어 빈 목록으로 둡니다.
    tags: [],
    thumbnail: row.thumbnail_url ?? undefined,
    createdAt: formatDate(row.created_at),
  };
}
