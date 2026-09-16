"use client";

import Image from "next/image";
import { useFormStatus } from "react-dom";
import { signInWithKakao } from "@/app/login/actions";

/**
 * 카카오 로그인 버튼. 로그인 폼 안에 두고 formAction으로 서버 액션을 갈아 끼우므로
 * 이메일·비밀번호 칸이 비어 있어도 누를 수 있습니다.
 * 이미지는 카카오 디자인 가이드의 공식 버튼(public/kakao_login_large_wide.png)을 그대로 씁니다.
 */
export function KakaoLoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formAction={signInWithKakao}
      disabled={pending}
      aria-label="카카오 로그인"
      className="kakao-login-button block w-full overflow-hidden rounded-[12px] outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Image
        src="/kakao_login_large_wide.png"
        alt=""
        width={600}
        height={90}
        priority
        className="h-auto w-full"
      />
    </button>
  );
}
