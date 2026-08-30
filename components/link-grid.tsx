import { LinkCard } from "./link-card";
import type { LinkItem } from "@/app/lib/types";

export function LinkGrid({ links }: { links: LinkItem[] }) {
  // 썸네일 유무로 카드 높이가 달라서, 늘리지 않고 내용만큼만 차지하게 둡니다.
  return (
    <ul className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard link={link} />
        </li>
      ))}
    </ul>
  );
}
