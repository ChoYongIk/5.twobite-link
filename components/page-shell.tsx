import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";

/** 모든 페이지가 공유하는 배경과 상단 헤더. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-[var(--bg)]">
      <SiteHeader />
      {children}
    </div>
  );
}
