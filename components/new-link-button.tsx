import Link from "next/link";
import { PlusIcon } from "./icons";

export function NewLinkButton() {
  return (
    <Link
      href="/new"
      className="flex h-10 items-center gap-1.5 rounded-full bg-zinc-900 pr-4 pl-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus-visible:ring-offset-zinc-950"
    >
      <PlusIcon className="size-4.5" />
      <span>새 링크</span>
    </Link>
  );
}
