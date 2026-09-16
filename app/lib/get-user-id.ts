import { cache } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/**
 * 현재 요청의 로그인 사용자 id를 돌려줍니다. 로그인하지 않았으면 null입니다.
 * 쿠키의 액세스 토큰을 getClaims()로 검증해서 읽으므로 세션 객체의 user를 그대로 믿지 않습니다.
 * React cache로 감싸 한 요청 안에서 레이아웃·폴더·링크 조회가 같은 결과를 공유합니다.
 */
export const getUserId = cache(async (): Promise<string | null> => {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    return null;
  }

  return data.claims.sub;
});
