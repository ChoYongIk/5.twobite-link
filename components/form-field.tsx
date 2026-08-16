import type { ReactNode } from "react";

/** 입력 요소가 공유하는 기본 스타일. 좌우 여백은 사용하는 쪽에서 지정합니다. */
export const fieldClass =
  "h-11 w-full rounded-lg border bg-white text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-amber-500/40 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600";

export const fieldBorderClass = (invalid: boolean) =>
  invalid
    ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/30 dark:border-red-500/60"
    : "border-zinc-300 focus-visible:border-amber-500 dark:border-zinc-700";

type FormFieldProps = {
  /** 라벨과 설명·오류 문구를 입력 요소에 연결하는 식별자. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ id, label, hint, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
      >
        {label}
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-zinc-500 dark:text-zinc-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
