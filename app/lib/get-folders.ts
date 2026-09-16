import { cache } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { toFolder, type FolderRow } from "./folders";
import { getUserId } from "./get-user-id";
import type { Folder } from "./types";

/**
 * 현재 로그인한 사용자의 폴더만 만든 순서대로 가져옵니다. 서버 컴포넌트에서만 부릅니다.
 * 로그인하지 않았으면 조회하지 않고 빈 목록을 돌려줍니다.
 * React cache로 감싸 한 요청 안에서 레이아웃과 폴더 페이지 메타데이터가 같은 결과를 공유합니다.
 */
export const getFolders = cache(async (): Promise<Folder[]> => {
  const userId = await getUserId();
  if (!userId) {
    return [];
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("folders")
    .select("id, name")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`폴더 목록을 불러오지 못했어요: ${error.message}`);
  }

  return (data as FolderRow[]).map(toFolder);
});
