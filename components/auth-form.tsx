"use client";

import type { FormEvent, ReactNode } from "react";

type AuthFormProps = {
  children: ReactNode;
  submitLabel: string;
  /** 제출 시 실행할 서버 액션. 없으면 아직 기능이 없는 폼으로 보고 제출을 막습니다. */
  action?: (formData: FormData) => void;
  /** 서버 액션으로 넘어가기 전에 화면에서 먼저 검사할 때 씁니다. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /** 입력이 아직 다 채워지지 않아 버튼을 잠글 때 true. */
  submitDisabled?: boolean;
  pending?: boolean;
  pendingLabel?: string;
};

/**
 * 로그인·회원가입 폼의 틀. action이 없으면 제출을 막아 둡니다.
 * (기본 GET 제출이 일어나면 비밀번호가 주소창에 남기 때문입니다.)
 */
export function AuthForm({
  children,
  submitLabel,
  action,
  onSubmit,
  submitDisabled = false,
  pending = false,
  pendingLabel,
}: AuthFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!action) {
      event.preventDefault();
      return;
    }
    onSubmit?.(event);
  };

  return (
    <form
      noValidate
      action={action}
      onSubmit={handleSubmit}
      className="surface flex w-full flex-col gap-5 p-6"
    >
      {children}

      <button
        type="submit"
        disabled={submitDisabled || pending}
        className="btn-primary mt-1 w-full px-6 py-3 text-[17px] leading-[1.5] font-medium"
      >
        {pending && pendingLabel ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
