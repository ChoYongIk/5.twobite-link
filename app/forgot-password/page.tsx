import { pageMetadata } from "@/app/lib/metadata";
import { AuthPage } from "@/components/auth-page";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata = pageMetadata({
  title: "비밀번호 찾기",
  description: "이메일로 비밀번호 재설정 링크를 받으세요.",
  path: "/forgot-password",
});

export default async function ForgotPasswordPage({
  searchParams,
}: PageProps<"/forgot-password">) {
  const { error } = await searchParams;
  // 메일 속 링크가 만료됐거나 잘못돼 콜백에서 되돌아온 경우입니다.
  const linkError =
    error === "link"
      ? "재설정 링크가 만료됐거나 올바르지 않아요. 다시 요청해 주세요."
      : undefined;

  return (
    <AuthPage
      title="비밀번호 찾기"
      description="이메일로 재설정 링크를 보내 드릴게요."
      footerText="비밀번호가 기억나셨나요?"
      footerLinkLabel="로그인"
      footerHref="/login"
    >
      <ForgotPasswordForm initialError={linkError} />
    </AuthPage>
  );
}
