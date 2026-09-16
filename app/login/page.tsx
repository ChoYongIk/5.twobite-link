import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "로그인 | 한입 링크",
  description: "이메일과 비밀번호로 한입 링크에 로그인하세요.",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const { error } = await searchParams;
  // 카카오 인증이 취소됐거나 콜백에서 세션을 만들지 못해 되돌아온 경우입니다.
  const oauthError =
    error === "oauth"
      ? "카카오 로그인에 실패했어요. 다시 시도해 주세요."
      : undefined;

  return (
    <AuthPage
      title="로그인"
      description="담아둔 링크를 다시 꺼내 보세요."
      footerText="아직 계정이 없으신가요?"
      footerLinkLabel="회원가입"
      footerHref="/signup"
      extraLink={{ label: "비밀번호를 잊으셨나요?", href: "/forgot-password" }}
    >
      <LoginForm initialError={oauthError} />
    </AuthPage>
  );
}
