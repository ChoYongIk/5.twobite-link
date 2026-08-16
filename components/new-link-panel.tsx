import { NewLinkForm } from "./new-link-form";
import type { Folder } from "@/app/lib/types";

export function NewLinkPanel({ folders }: { folders: Folder[] }) {
  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          새 링크
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
          주소를 담고 폴더를 골라 저장하세요.
        </p>
      </div>

      <NewLinkForm folders={folders} />
    </>
  );
}
