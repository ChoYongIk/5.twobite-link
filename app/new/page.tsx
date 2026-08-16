import type { Metadata } from "next";
import { NewLinkPanel } from "@/components/new-link-panel";
import { PageShell } from "@/components/page-shell";
import { Workspace } from "@/components/workspace";
import { folders, links } from "../lib/mock-data";

export const metadata: Metadata = {
  title: "새 링크 | 한입 링크",
  description: "링크 주소를 입력하고 폴더를 골라 저장하세요.",
};

export default function NewLinkPage() {
  return (
    <PageShell>
      <Workspace folders={folders} links={links}>
        <NewLinkPanel folders={folders} />
      </Workspace>
    </PageShell>
  );
}
