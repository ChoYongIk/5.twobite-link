"use client";

import { useActionState, useCallback, useState } from "react";
import { AuthForm } from "./auth-form";
import { FormField, fieldClass } from "./form-field";
import { CheckIcon } from "./icons";
import { Toast } from "./toast";
import {
  requestPasswordReset,
  type ResetRequestState,
} from "@/app/forgot-password/actions";

type ToastState = { message: string; key: number };

const initialState: ResetRequestState = { at: 0 };

type ForgotPasswordFormProps = {
  /** 페이지가 열릴 때 바로 띄울 오류. 만료된 링크로 되돌아온 경우에 씁니다. */
  initialError?: string;
};

export function ForgotPasswordForm({ initialError }: ForgotPasswordFormProps) {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<ToastState | null>(
    initialError ? { message: initialError, key: 1 } : null,
  );

  // 서버 액션이 새 결과를 돌려주면(at이 바뀌면) 그 오류를 토스트로 띄웁니다.
  // effect 대신 렌더 중에 상태를 맞추는 React 권장 패턴입니다.
  const [seenAt, setSeenAt] = useState(initialState.at);
  if (state.at !== seenAt) {
    setSeenAt(state.at);
    setToast(state.error ? { message: state.error, key: state.at } : null);
  }

  const closeToast = useCallback(() => setToast(null), []);

  return (
    <>
      {toast ? (
        <Toast
          message={toast.message}
          toastKey={toast.key}
          onClose={closeToast}
        />
      ) : null}

      <AuthForm
        submitLabel="재설정 링크 보내기"
        pendingLabel="보내는 중…"
        action={formAction}
        submitDisabled={email.trim() === ""}
        pending={pending}
      >
        <FormField
          id="reset-email"
          label="이메일"
          hint="가입할 때 쓴 이메일을 입력하면 재설정 링크를 보내 드려요."
        >
          <input
            id="reset-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-describedby="reset-email-hint"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </FormField>

        {state.sentTo ? (
          <p
            role="status"
            className="flex items-start gap-2 rounded-[10px] bg-[var(--fill)] px-4 py-3 text-[14px] leading-[1.4] text-[var(--success)]"
          >
            <CheckIcon className="mt-[3px] size-4 shrink-0" />
            <span>
              <span className="font-medium">{state.sentTo}</span> 으로 재설정
              링크를 보냈어요. 받은 편지함을 확인해 주세요.
            </span>
          </p>
        ) : null}
      </AuthForm>
    </>
  );
}
