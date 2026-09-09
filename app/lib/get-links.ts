import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { toLinkItem, type LinkRow } from "./links";
import type { LinkItem } from "./types";

/** links 테이블의 링크를 최근에 담은 순서대로 가져옵니다. 서버 컴포넌트에서만 부릅니다. */
export async function getLinks(): Promise<LinkItem[]> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("links")
    .select("id, url, title, description, thumbnail_url, folder_id, created_at")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`링크 목록을 불러오지 못했어요: ${error.message}`);
  }

  return (data as LinkRow[]).map(toLinkItem);
}
