export type Folder = {
  id: string;
  name: string;
  emoji: string;
};

export type LinkItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  folderId: Folder["id"];
  tags: string[];
  /** 오픈 그래프에서 가져온 썸네일 주소. 없을 수도 있습니다. */
  thumbnail?: string;
  /** 하이드레이션 불일치를 피하기 위해 포맷된 문자열로 보관합니다. */
  createdAt: string;
};

export const ALL_FOLDER_ID = "all";
