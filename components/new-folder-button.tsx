"use client";

import { useState } from "react";
import { FolderNameModal } from "./folder-name-modal";
import { useFolders } from "./folders-provider";
import { FolderPlusIcon } from "./icons";

export function NewFolderButton() {
  const { addFolder } = useFolders();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary flex items-center gap-1.5 px-2 py-1.5 text-[14px] leading-[1.4] font-medium"
      >
        <FolderPlusIcon className="size-4" />
        <span>새 폴더</span>
      </button>

      <FolderNameModal
        open={open}
        title="새 폴더"
        onClose={() => setOpen(false)}
        onSubmit={async (name) => {
          // 저장이 실패하면 모달이 오류를 보여 주도록 닫지 않고 그대로 던집니다.
          await addFolder(name);
          setOpen(false);
        }}
      />
    </>
  );
}
