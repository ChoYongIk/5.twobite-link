import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/** 메일 속 링크가 돌아오는 자리. 토큰을 세션으로 바꾼 뒤 next로 보냅니다. */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));

  // 링크에 실린 비밀 값은 주소창에 남지 않도록 지우고 이동합니다.
  const redirectTo = request.nextUrl.clone();
  redirectTo.search = "";

  const supabase = createClient(await cookies());
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const flowId = searchParams.get("sb_flow_id");

  let failed = true;
  if (tokenHash && type) {
    // 메일 템플릿을 token_hash 방식으로 바꾼 경우.
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    failed = Boolean(error);
  } else if (code) {
    // 기본 템플릿(PKCE)인 경우. 링크를 요청한 브라우저에서만 교환할 수 있습니다.
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );
    failed = Boolean(error);
  }

  if (failed) {
    redirectTo.pathname = "/forgot-password";
    redirectTo.searchParams.set("error", "link");
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
