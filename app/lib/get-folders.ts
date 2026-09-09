import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { toFolder, type FolderRow } from "./folders";
import type { Folder } from "./types";

/** folders 테이블의 폴더를 만든 순서대로 가져옵니다. 서버 컴포넌트에서만 부릅니다. */
export async function getFolders(): Promise<Folder[]> {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("folders")
    .select("id, name")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`폴더 목록을 불러오지 못했어요: ${error.message}`);
  }

  return (data as FolderRow[]).map(toFolder);
}
