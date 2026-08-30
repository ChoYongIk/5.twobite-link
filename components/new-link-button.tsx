import Link from "next/link";
import { PlusIcon } from "./icons";

/** 헤더 높이(48px)에 맞춰 pill 버튼을 한 단계 작게 씁니다. */
export function NewLinkButton() {
  return (
    <Link
      href="/new"
      className="btn-primary flex items-center gap-1.5 px-4 py-1.5 text-[14px] leading-[1.4] font-medium"
    >
      <PlusIcon className="size-4" />
      <span>새 링크</span>
    </Link>
  );
}
