import { AllLinksView } from "@/components/all-links-view";
import { PageShell } from "@/components/page-shell";
import { Workspace } from "@/components/workspace";

export default function Home() {
  return (
    <PageShell>
      <Workspace>
        <AllLinksView />
      </Workspace>
    </PageShell>
  );
}
