"use client";

import { LinkSection } from "./link-section";
import { useLinks } from "./links-provider";

export function AllLinksView() {
  const { links } = useLinks();

  return <LinkSection title="전체 링크" links={links} />;
}
