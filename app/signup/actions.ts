"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MIN_PASSWORD_LENGTH } from "@/app/lib/auth";
import { createClient } from "@/utils/supabase/server";

export type SignUpState = {
  error?: string;
  /** 같은 오류가 연달아 나도 토스트를 다시 띄우도록 매번 바뀌는 값. */
  at: number;
};

/** Supabase Auth 오류 코드를 사용자에게 보여 줄 한국어 문구로 바꿉니다. */
function messageFor(code: string | undefined): string {
  switch (code) {
    case "user_already_exists":
    case "email_exists":
      return "이미 가입된 이메일이에요. 로그인해 주세요.";
    case "weak_password":
      return `비밀번호가 너무 약해요. ${MIN_PASSWORD_LENGTH}자 이상으로 입력해 주세요.`;
    case "email_address_invalid":
    case "validation_failed":
      return "이메일 주소 형식이 올바르지 않아요.";
    case "signup_disabled":
      return "지금은 회원가입을 받지 않고 있어요.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
    default:
      return "회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.";
  }
}

function fail(error: string): SignUpState {
  return { error, at: Date.now() };
}

export async function signUp(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  // 화면에서 한 번 걸렀지만 서버 액션은 직접 호출될 수 있어 다시 확인합니다.
  if (!email || !password || !passwordConfirm) {
    return fail("이메일과 비밀번호를 모두 입력해 주세요.");
  }
  if (password !== passwordConfirm) {
    return fail("비밀번호가 서로 달라요. 다시 확인해 주세요.");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return fail(`비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상 입력해 주세요.`);
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return fail(messageFor(error.code));
  }

  // 이메일 인증을 켜 둔 프로젝트는 이미 가입된 주소여도 오류 대신
  // identities가 빈 사용자 객체를 돌려줍니다. 이 경우도 실패로 안내합니다.
  if (data.user && data.user.identities?.length === 0) {
    return fail(messageFor("user_already_exists"));
  }

  revalidatePath("/", "layout");
  redirect("/");
}
