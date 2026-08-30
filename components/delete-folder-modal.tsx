"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Folder } from "@/app/lib/types";

type DeleteFolderModalProps = {
  /** 삭제를 확인할 폴더. null이면 닫힌 상태입니다. */
  folder: Folder | null;
  onClose: () => void;
  onConfirm: (folder: Folder) => void;
};

export function DeleteFolderModal({
  folder,
  onClose,
  onConfirm,
}: DeleteFolderModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // 닫히는 0.3초 동안 이름이 사라지지 않도록 마지막 폴더를 붙들어 둡니다.
  const [shown, setShown] = useState<Folder | null>(folder);

  if (folder && folder !== shown) {
    setShown(folder);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (folder && !dialog.open) {
      dialog.showModal();
    } else if (!folder && dialog.open) {
      dialog.close();
    }
  }, [folder]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby="delete-folder-title"
      className="modal"
    >
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h2
            id="delete-folder-title"
            className="text-[24px] leading-[1.2] font-semibold tracking-[-0.3px] text-[var(--text)]"
          >
            폴더를 삭제할까요?
          </h2>
          <p className="text-[17px] leading-[1.5] text-[var(--text-sub)]">
            <span className="font-medium text-[var(--text)]">
              {shown?.name}
            </span>{" "}
            폴더가 사이드바에서 사라져요. 담아둔 링크는 지워지지 않고 전체
            링크에 남아요.
          </p>
        </div>

        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-4 py-3 text-[17px] leading-[1.5] font-medium"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              if (folder) {
                onConfirm(folder);
              }
            }}
            className="btn-danger px-6 py-3 text-[17px] leading-[1.5] font-medium"
          >
            삭제
          </button>
        </div>
      </div>
    </dialog>
  );
}
