import Link from "next/link";
import { FolderIcon } from "./icons";

/** 주소에 해당하는 폴더가 없을 때 보여주는 안내 화면. */
export function FolderMissing() {
  return (
    <div className="surface flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-[var(--fill)] text-[var(--text-sub)]">
        <FolderIcon className="size-6" />
      </span>
      <p className="mt-5 text-[17px] leading-[1.5] font-semibold tracking-[-0.2px] text-[var(--text)]">
        찾을 수 없는 폴더예요
      </p>
      <p className="mt-2 text-[14px] leading-[1.4] text-[var(--text-sub)]">
        주소가 바뀌었거나 삭제된 폴더일 수 있어요.
      </p>
      <Link
        href="/"
        className="btn-primary mt-7 px-6 py-3 text-[17px] leading-[1.5] font-medium"
      >
        전체 링크로 가기
      </Link>
    </div>
  );
}
