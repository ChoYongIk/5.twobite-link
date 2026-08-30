import type { ReactNode } from "react";

/** 입력 요소가 공유하는 여백과 글자 크기. 색·보더·포커스는 globals.css의 .field가 담당합니다. */
export const fieldClass = "field w-full px-4 py-3 text-[17px] leading-[1.5]";

type FormFieldProps = {
  /** 라벨과 설명·오류 문구를 입력 요소에 연결하는 식별자. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({
  id,
  label,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[14px] leading-[1.4] font-medium text-[var(--text)]"
      >
        {label}
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[14px] leading-[1.4] text-[var(--error)]"
        >
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${id}-hint`}
          className="text-[14px] leading-[1.4] text-[var(--text-sub)]"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
