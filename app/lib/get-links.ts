import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getUserId } from "./get-user-id";
import { toLinkItem, type LinkRow } from "./links";
import type { LinkItem } from "./types";

/**
 * 현재 로그인한 사용자의 링크만 최근에 담은 순서대로 가져옵니다. 서버 컴포넌트에서만 부릅니다.
 * 로그인하지 않았으면 조회하지 않고 빈 목록을 돌려줍니다.
 */
export async function getLinks(): Promise<LinkItem[]> {
  const userId = await getUserId();
  if (!userId) {
    return [];
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("links")
    .select("id, url, title, description, thumbnail_url, folder_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`링크 목록을 불러오지 못했어요: ${error.message}`);
  }

  return (data as LinkRow[]).map(toLinkItem);
}
