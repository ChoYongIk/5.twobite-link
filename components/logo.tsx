import Link from "next/link";
import { BookmarkIcon } from "./icons";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-[17px] leading-none font-semibold tracking-[-0.2px] text-[var(--text)] outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]"
    >
      <BookmarkIcon className="size-[18px] text-[var(--accent)]" />
      <span>한입 링크</span>
    </Link>
  );
}
