import { LinkCard } from "./link-card";
import type { LinkItem } from "@/app/lib/types";

export function LinkGrid({ links }: { links: LinkItem[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard link={link} />
        </li>
      ))}
    </ul>
  );
}
