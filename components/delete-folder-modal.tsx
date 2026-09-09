"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Folder } from "@/app/lib/types";

type DeleteFolderModalProps = {
  /** 삭제를 확인할 폴더. null이면 닫힌 상태입니다. */
  folder: Folder | null;
  onClose: () => void;
  /** 삭제를 처리합니다. Promise를 돌려주면 끝날 때까지 삭제 버튼을 잠급니다. */
  onConfirm: (folder: Folder) => void | Promise<void>;
};

export function DeleteFolderModal({
  folder,
  onClose,
  onConfirm,
}: DeleteFolderModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // 닫히는 0.3초 동안 이름이 사라지지 않도록 마지막 폴더를 붙들어 둡니다.
  const [shown, setShown] = useState<Folder | null>(folder);

  const [error, setError] = useState<string>();
  // 삭제가 끝나기 전에 다시 눌러도 두 번 지우지 않게 막습니다.
  // 상태 갱신은 다음 렌더에야 반영되므로 같은 틱의 연타는 ref로 걸러냅니다.
  const [deleting, setDeleting] = useState(false);
  const deletingRef = useRef(false);

  if (folder && folder !== shown) {
    setShown(folder);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (folder && !dialog.open) {
      setError(undefined);
      setDeleting(false);
      deletingRef.current = false;
      dialog.showModal();
    } else if (!folder && dialog.open) {
      dialog.close();
    }
  }, [folder]);

  const handleConfirm = async () => {
    if (!folder || deletingRef.current) {
      return;
    }

    deletingRef.current = true;
    setDeleting(true);
    setError(undefined);
    try {
      await onConfirm(folder);
    } catch {
      setError("폴더를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      deletingRef.current = false;
      setDeleting(false);
    }
  };

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
          {error && (
            <p
              role="alert"
              className="text-[14px] leading-[1.4] text-[var(--error)]"
            >
              {error}
            </p>
          )}
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
            onClick={handleConfirm}
            disabled={deleting}
            aria-busy={deleting || undefined}
            className="btn-danger px-6 py-3 text-[17px] leading-[1.5] font-medium"
          >
            {deleting ? "삭제 중…" : "삭제"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
