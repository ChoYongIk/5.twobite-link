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
        onSubmit={(name) => {
          addFolder(name);
          setOpen(false);
        }}
      />
    </>
  );
}
