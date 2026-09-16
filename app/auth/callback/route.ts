import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * 소셜 로그인(OAuth)이 돌아오는 자리. Supabase가 붙여 준 code를 세션으로 바꾼 뒤
 * next로 보냅니다. 메일 링크 콜백(/auth/confirm)과 달리 실패하면 로그인 페이지로 돌아갑니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));

  // 주소창에 code가 남지 않도록 지우고 이동합니다.
  const redirectTo = request.nextUrl.clone();
  redirectTo.search = "";

  const code = searchParams.get("code");
  let failed = true;
  if (code) {
    // PKCE 흐름이라 로그인을 시작한 브라우저(코드 검증값 쿠키가 있는 곳)에서만 교환됩니다.
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = Boolean(error);
  }

  if (failed) {
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set("error", "oauth");
    return NextResponse.redirect(redirectTo);
  }

  redirectTo.pathname = next;
  return NextResponse.redirect(redirectTo);
}

/** 외부 주소로 튕기지 않도록 사이트 안의 경로만 허용합니다. */
function safeNext(value: string | null) {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}
