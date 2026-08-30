import { FolderIcon } from "./icons";

export function EmptyState({ folderName }: { folderName: string }) {
  return (
    <div className="surface flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-[var(--fill)] text-[var(--text-sub)]">
        <FolderIcon className="size-6" />
      </span>
      <p className="mt-5 text-[17px] leading-[1.5] font-semibold tracking-[-0.2px] text-[var(--text)]">
        {folderName}에 저장된 링크가 없어요
      </p>
      <p className="mt-2 text-[14px] leading-[1.4] text-[var(--text-sub)]">
        오른쪽 위 &lsquo;새 링크&rsquo; 버튼으로 첫 링크를 담아보세요.
      </p>
    </div>
  );
}
