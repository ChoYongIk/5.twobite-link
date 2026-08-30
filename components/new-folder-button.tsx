"use client";

import { useState } from "react";
import { FolderPlusIcon } from "./icons";
import { NewFolderModal } from "./new-folder-modal";

export function NewFolderButton() {
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

      <NewFolderModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
