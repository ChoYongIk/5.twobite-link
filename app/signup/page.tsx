import { pageMetadata } from "@/app/lib/metadata";
import { AuthPage } from "@/components/auth-page";
import { SignupForm } from "@/components/signup-form";

export const metadata = pageMetadata({
  title: "회원가입",
  description: "이메일과 비밀번호로 한입 링크 계정을 만드세요.",
  path: "/signup",
});

export default function SignupPage() {
  return (
    <AuthPage
      title="회원가입"
      description="한 입에 담는 북마크, 지금 시작하세요."
      footerText="이미 계정이 있으신가요?"
      footerLinkLabel="로그인"
      footerHref="/login"
    >
      <SignupForm />
    </AuthPage>
  );
}
