"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/** 현재 세션을 끝내고 로그인 페이지로 보냅니다. */
export async function signOut() {
  const supabase = createClient(await cookies());
  // 세션이 이미 만료됐어도 쿠키는 지워지므로 오류는 따로 다루지 않습니다.
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
