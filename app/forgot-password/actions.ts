"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export type ResetRequestState = {
  error?: string;
  /** 메일을 보낸 주소. 성공 안내에 씁니다. */
  sentTo?: string;
  /** 같은 결과가 연달아 나도 화면이 다시 반응하도록 매번 바뀌는 값. */
  at: number;
};

/** Supabase Auth 오류 코드를 사용자에게 보여 줄 한국어 문구로 바꿉니다. */
function messageFor(code: string | undefined): string {
  switch (code) {
    case "validation_failed":
    case "email_address_invalid":
      return "이메일 주소 형식이 올바르지 않아요.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "메일을 너무 자주 보냈어요. 잠시 후 다시 시도해 주세요.";
    default:
      return "메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.";
  }
}

export async function requestPasswordReset(
  _prev: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const email = String(formData.get("email") ?? "").trim();

  // 화면에서 한 번 걸렀지만 서버 액션은 직접 호출될 수 있어 다시 확인합니다.
  if (!email) {
    return { error: "이메일을 입력해 주세요.", at: Date.now() };
  }

  // 메일 속 링크는 콜백에서 토큰을 세션으로 바꾼 뒤 새 비밀번호 페이지로 이동합니다.
  const origin = (await headers()).get("origin") ?? "";
  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  if (error) {
    return { error: messageFor(error.code), at: Date.now() };
  }

  // 가입되지 않은 주소여도 Supabase는 성공으로 답하므로(주소 유출 방지) 그대로 안내합니다.
  return { sentTo: email, at: Date.now() };
}
