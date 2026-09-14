"use client";

import { useActionState, useCallback, useState } from "react";
import type { FormEvent } from "react";
import { AuthForm } from "./auth-form";
import { FormField, fieldClass } from "./form-field";
import { Toast } from "./toast";
import { MIN_PASSWORD_LENGTH } from "@/app/lib/auth";
import { signUp, type SignUpState } from "@/app/signup/actions";

type ToastState = { message: string; key: number };

const initialState: SignUpState = { at: 0 };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  // 세 칸을 모두 채워야 버튼이 열립니다.
  const filled =
    email.trim() !== "" && password !== "" && passwordConfirm !== "";

  // 서버 액션이 새 결과를 돌려주면(at이 바뀌면) 그 오류를 토스트로 띄웁니다.
  // effect 대신 렌더 중에 상태를 맞추는 React 권장 패턴입니다.
  const [seenAt, setSeenAt] = useState(initialState.at);
  if (state.at !== seenAt) {
    setSeenAt(state.at);
    setToast(state.error ? { message: state.error, key: state.at } : null);
  }

  const closeToast = useCallback(() => setToast(null), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // 비밀번호가 다르면 서버까지 가지 않고 바로 알려 줍니다.
    if (password !== passwordConfirm) {
      event.preventDefault();
      setToast({
        message: "비밀번호가 서로 달라요. 다시 확인해 주세요.",
        key: Date.now(),
      });
    }
  };

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
        submitLabel="회원가입"
        pendingLabel="가입 중…"
        action={formAction}
        onSubmit={handleSubmit}
        submitDisabled={!filled}
        pending={pending}
      >
        <FormField id="signup-email" label="이메일">
          <input
            id="signup-email"
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

        <FormField
          id="signup-password"
          label="비밀번호"
          hint={`${MIN_PASSWORD_LENGTH}자 이상 입력해 주세요.`}
        >
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 입력하세요"
            aria-describedby="signup-password-hint"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
          />
        </FormField>

        <FormField id="signup-password-confirm" label="비밀번호 확인">
          <input
            id="signup-password-confirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 한 번 더 입력하세요"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            className={fieldClass}
          />
        </FormField>
      </AuthForm>
    </>
  );
}
