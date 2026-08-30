import { FolderMissing } from "@/components/folder-missing";
import { PageShell } from "@/components/page-shell";
import { Workspace } from "@/components/workspace";
import { links } from "@/app/lib/mock-data";

export default function FolderNotFound() {
  return (
    <PageShell>
      <Workspace links={links}>
        <FolderMissing />
      </Workspace>
    </PageShell>
  );
}
