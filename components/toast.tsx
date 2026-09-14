"use client";

import { useEffect } from "react";
import { XIcon } from "./icons";

type ToastProps = {
  message: string;
  /** 같은 문구가 다시 와도 새로 띄우도록 부모가 바꿔 주는 값. */
  toastKey: number;
  onClose: () => void;
  /** 자동으로 닫히기까지의 시간(ms). */
  duration?: number;
};

/** 화면 상단 가운데에 뜨는 오류 알림. 일정 시간이 지나거나 닫기를 누르면 사라집니다. */
export function Toast({
  message,
  toastKey,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [toastKey, duration, onClose]);

  return (
    <div
      role="alert"
      className="toast fixed top-6 left-1/2 z-30 flex w-[calc(100%-48px)] max-w-[420px] -translate-x-1/2 items-start gap-3 py-3 pr-3 pl-4"
    >
      <p className="flex-1 text-[14px] leading-[1.4] text-[var(--error)]">
        {message}
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label="알림 닫기"
        className="toast-close flex size-6 shrink-0 items-center justify-center rounded-full"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}
