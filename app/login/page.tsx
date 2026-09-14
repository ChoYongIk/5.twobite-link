import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "로그인 | 한입 링크",
  description: "이메일과 비밀번호로 한입 링크에 로그인하세요.",
};

export default function LoginPage() {
  return (
    <AuthPage
      title="로그인"
      description="담아둔 링크를 다시 꺼내 보세요."
      footerText="아직 계정이 없으신가요?"
      footerLinkLabel="회원가입"
      footerHref="/signup"
    >
      <LoginForm />
    </AuthPage>
  );
}
