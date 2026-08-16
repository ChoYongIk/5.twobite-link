import Link from "next/link";
import { FolderIcon } from "@/components/icons";
import { PageShell } from "@/components/page-shell";
import { Workspace } from "@/components/workspace";
import { folders, links } from "@/app/lib/mock-data";

export default function FolderNotFound() {
  return (
    <PageShell>
      <Workspace folders={folders} links={links}>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-800">
          <span className="flex size-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600">
            <FolderIcon className="size-5.5" />
          </span>
          <p className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            찾을 수 없는 폴더예요
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            주소가 바뀌었거나 삭제된 폴더일 수 있어요.
          </p>
          <Link
            href="/"
            className="mt-5 flex h-10 items-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus-visible:ring-offset-zinc-950"
          >
            전체 링크로 가기
          </Link>
        </div>
      </Workspace>
    </PageShell>
  );
}
