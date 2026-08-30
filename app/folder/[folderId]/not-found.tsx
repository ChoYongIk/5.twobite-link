import { FolderMissing } from "@/components/folder-missing";
import { PageShell } from "@/components/page-shell";
import { Workspace } from "@/components/workspace";

export default function FolderNotFound() {
  return (
    <PageShell>
      <Workspace>
        <FolderMissing />
      </Workspace>
    </PageShell>
  );
}
