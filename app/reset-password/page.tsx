import { pageMetadata } from "@/app/lib/metadata";
import { AuthPage } from "@/components/auth-page";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata = pageMetadata({
  title: "비밀번호 재설정",
  description: "새 비밀번호를 정하세요.",
  path: "/reset-password",
});

/** 메일 속 재설정 링크로 들어온 사용자가 새 비밀번호를 정하는 페이지. 세션이 있어야 열립니다. */
export default function ResetPasswordPage() {
  return (
    <AuthPage
      title="비밀번호 재설정"
      description="새로 사용할 비밀번호를 입력해 주세요."
      footerText="링크가 만료됐나요?"
      footerLinkLabel="다시 요청하기"
      footerHref="/forgot-password"
    >
      <ResetPasswordForm />
    </AuthPage>
  );
}
