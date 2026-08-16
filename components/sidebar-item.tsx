import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  count: number;
  href: ComponentProps<typeof Link>["href"];
  active: boolean;
};

export function SidebarItem({
  icon,
  label,
  count,
  href,
  active,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex w-full shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
        active
          ? "bg-amber-50 font-medium text-amber-900 dark:bg-amber-500/15 dark:text-amber-200"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
      }`}
    >
      <span className="flex size-5 shrink-0 items-center justify-center text-base leading-none">
        {icon}
      </span>
      <span className="flex-1 truncate text-left">{label}</span>
      <span
        className={`shrink-0 text-xs tabular-nums ${
          active
            ? "text-amber-700 dark:text-amber-300/80"
            : "text-zinc-400 dark:text-zinc-600"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
