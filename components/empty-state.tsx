import { FolderIcon } from "./icons";

export function EmptyState({ folderName }: { folderName: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-800">
      <span className="flex size-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600">
        <FolderIcon className="size-5.5" />
      </span>
      <p className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {folderName}에 저장된 링크가 없어요
      </p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
        오른쪽 위 &lsquo;새 링크&rsquo; 버튼으로 첫 링크를 담아보세요.
      </p>
    </div>
  );
}
