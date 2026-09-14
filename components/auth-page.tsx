import Link from "next/link";
import type { ReactNode } from "react";
import { BookmarkIcon } from "./icons";

type AuthPageProps = {
  title: string;
  description: string;
  children: ReactNode;
  /** 폼 아래에 놓는 안내 문구. 예) 아직 계정이 없으신가요? */
  footerText: string;
  footerLinkLabel: string;
  footerHref: "/login" | "/signup";
};

/** 사이드바·헤더 없이 화면 가운데에 로고와 폼만 놓는 인증 페이지 틀. */
export function AuthPage({
  title,
  description,
  children,
  footerText,
  footerLinkLabel,
  footerHref,
}: AuthPageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[var(--bg)] px-6 py-14">
      <div className="flex w-full max-w-[400px] flex-col items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-[24px] leading-[1.2] font-semibold tracking-[-0.3px] text-[var(--text)] outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]"
        >
          <BookmarkIcon className="size-6 text-[var(--accent)]" />
          <span>한입 링크</span>
        </Link>

        <div className="mt-12 mb-8 text-center">
          <h1 className="text-[40px] leading-[1.1] font-semibold tracking-[-0.5px] text-[var(--text)]">
            {title}
          </h1>
          <p className="mt-4 text-[17px] leading-[1.5] text-[var(--text-sub)]">
            {description}
          </p>
        </div>

        {children}

        <p className="mt-8 text-[14px] leading-[1.4] text-[var(--text-sub)]">
          {footerText}{" "}
          <Link href={footerHref} className="link-accent font-medium">
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
