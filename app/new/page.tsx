import { pageMetadata } from "@/app/lib/metadata";
import { NewLinkPanel } from "@/components/new-link-panel";
import { PageShell } from "@/components/page-shell";
import { Workspace } from "@/components/workspace";

export const metadata = pageMetadata({
  title: "새 링크",
  description: "링크 주소를 입력하고 폴더를 골라 저장하세요.",
  path: "/new",
});

export default function NewLinkPage() {
  return (
    <PageShell>
      <Workspace>
        <NewLinkPanel />
      </Workspace>
    </PageShell>
  );
}
