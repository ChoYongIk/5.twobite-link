import { LinkSection } from "@/components/link-section";
import { PageShell } from "@/components/page-shell";
import { Workspace } from "@/components/workspace";
import { folders, links } from "./lib/mock-data";

export default function Home() {
  return (
    <PageShell>
      <Workspace folders={folders} links={links}>
        <LinkSection title="전체 링크" links={links} />
      </Workspace>
    </PageShell>
  );
}
