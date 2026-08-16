import Link from "next/link";
import { BookmarkIcon } from "./icons";

export function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 rounded-lg px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm transition-transform group-hover:-rotate-6">
        <BookmarkIcon className="size-4.5" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        한입 링크
      </span>
    </Link>
  );
}
