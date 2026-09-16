"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type SignInState = {
  error?: string;
  /** 같은 오류가 연달아 나도 토스트를 다시 띄우도록 매번 바뀌는 값. */
  at: number;
};

/** Supabase Auth 오류 코드를 사용자에게 보여 줄 한국어 문구로 바꿉니다. */
function messageFor(code: string | undefined): string {
  switch (code) {
    case "invalid_credentials":
      return "이메일 또는 비밀번호가 올바르지 않아요.";
    case "email_not_confirmed":
      return "이메일 인증이 아직 끝나지 않았어요. 받은 편지함을 확인해 주세요.";
    case "user_banned":
      return "이용이 제한된 계정이에요.";
    case "validation_failed":
    case "email_address_invalid":
      return "이메일 주소 형식이 올바르지 않아요.";
    case "over_request_rate_limit":
      return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
    default:
      return "로그인에 실패했어요. 잠시 후 다시 시도해 주세요.";
  }
}

function fail(error: string): SignInState {
  return { error, at: Date.now() };
}

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // 화면에서 한 번 걸렀지만 서버 액션은 직접 호출될 수 있어 다시 확인합니다.
  if (!email || !password) {
    return fail("이메일과 비밀번호를 모두 입력해 주세요.");
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return fail(messageFor(error.code));
  }

  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * 카카오 로그인을 시작합니다. Supabase가 돌려준 카카오 인증 주소로 브라우저를 보내고,
 * 인증이 끝나면 /auth/callback으로 돌아와 세션이 만들어집니다.
 */
export async function signInWithKakao() {
  const origin = (await headers()).get("origin") ?? "";
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  // 서버에서는 자동으로 이동하지 않으므로 받은 주소로 직접 보냅니다.
  if (error || !data.url) {
    redirect("/login?error=oauth");
  }
  redirect(data.url);
}
