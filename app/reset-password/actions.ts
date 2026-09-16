"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MIN_PASSWORD_LENGTH } from "@/app/lib/auth";
import { createClient } from "@/utils/supabase/server";

export type UpdatePasswordState = {
  error?: string;
  /** 같은 오류가 연달아 나도 토스트를 다시 띄우도록 매번 바뀌는 값. */
  at: number;
};

/** Supabase Auth 오류 코드를 사용자에게 보여 줄 한국어 문구로 바꿉니다. */
function messageFor(code: string | undefined): string {
  switch (code) {
    case "same_password":
      return "이전과 같은 비밀번호예요. 다른 비밀번호를 입력해 주세요.";
    case "weak_password":
      return `비밀번호가 너무 약해요. ${MIN_PASSWORD_LENGTH}자 이상으로 입력해 주세요.`;
    case "session_expired":
    case "session_not_found":
    case "user_not_found":
      return "재설정 링크가 만료됐어요. 다시 요청해 주세요.";
    case "over_request_rate_limit":
      return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
    default:
      return "비밀번호를 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.";
  }
}

function fail(error: string): UpdatePasswordState {
  return { error, at: Date.now() };
}

export async function updatePassword(
  _prev: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  // 화면에서 한 번 걸렀지만 서버 액션은 직접 호출될 수 있어 다시 확인합니다.
  if (!password || !passwordConfirm) {
    return fail("새 비밀번호를 모두 입력해 주세요.");
  }
  if (password !== passwordConfirm) {
    return fail("비밀번호가 서로 달라요. 다시 확인해 주세요.");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return fail(`비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상 입력해 주세요.`);
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return fail(messageFor(error.code));
  }

  revalidatePath("/", "layout");
  redirect("/");
}
