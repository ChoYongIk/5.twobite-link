"use client";

import { useFormStatus } from "react-dom";
import { LogoutIcon } from "./icons";
import { signOut } from "@/app/logout/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="nav-item flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] leading-[1.4] outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogoutIcon className="size-4 shrink-0" />
      <span className="flex-1 truncate text-left">
        {pending ? "로그아웃 중…" : "로그아웃"}
      </span>
    </button>
  );
}

/** 사이드바 맨 아래의 로그아웃 버튼. 서버 액션으로 세션을 끝냅니다. */
export function LogoutButton() {
  return (
    <form action={signOut}>
      <SubmitButton />
    </form>
  );
}
