import type { Folder } from "./types";

/** folders 테이블에서 화면이 쓰는 컬럼. */
export type FolderRow = {
  id: number;
  name: string;
};

/** 아직 이모지를 고르는 UI가 없어 DB 폴더에는 기본 아이콘을 붙입니다. */
export const DEFAULT_FOLDER_EMOJI = "📁";

/** DB 행을 화면 모델로 바꿉니다. id는 라우트 파라미터와 맞추기 위해 문자열로 둡니다. */
export function toFolder(row: FolderRow): Folder {
  return {
    id: String(row.id),
    name: row.name,
    emoji: DEFAULT_FOLDER_EMOJI,
  };
}
