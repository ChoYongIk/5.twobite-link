"use client";

import { useActionState, useCallback, useState } from "react";
import { AuthForm } from "./auth-form";
import { FormField, fieldClass } from "./form-field";
import { Toast } from "./toast";
import { signIn, type SignInState } from "@/app/login/actions";

type ToastState = { message: string; key: number };

const initialState: SignInState = { at: 0 };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  // 두 칸을 모두 채워야 버튼이 열립니다.
  const filled = email.trim() !== "" && password !== "";

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
        submitLabel="로그인"
        pendingLabel="로그인 중…"
        action={formAction}
        submitDisabled={!filled}
        pending={pending}
      >
        <FormField id="login-email" label="이메일">
          <input
            id="login-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </FormField>

        <FormField id="login-password" label="비밀번호">
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
          />
        </FormField>
      </AuthForm>
    </>
  );
}
