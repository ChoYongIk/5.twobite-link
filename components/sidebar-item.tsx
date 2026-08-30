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
      className="nav-item flex w-full shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] leading-[1.4] outline-none"
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-[13px] leading-none">
        {icon}
      </span>
      <span className="flex-1 truncate text-left">{label}</span>
      <span className="shrink-0 text-[13px] tabular-nums text-[var(--text-sub)]">
        {count}
      </span>
    </Link>
  );
}
