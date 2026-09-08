"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { LinkItem } from "@/app/lib/types";

type DeleteLinkModalProps = {
  /** 삭제를 확인할 링크. null이면 닫힌 상태입니다. */
  link: LinkItem | null;
  onClose: () => void;
  onConfirm: (link: LinkItem) => void;
};

export function DeleteLinkModal({
  link,
  onClose,
  onConfirm,
}: DeleteLinkModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // 닫히는 0.3초 동안 제목이 사라지지 않도록 마지막 링크를 붙들어 둡니다.
  const [shown, setShown] = useState<LinkItem | null>(link);

  if (link && link !== shown) {
    setShown(link);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (link && !dialog.open) {
      dialog.showModal();
    } else if (!link && dialog.open) {
      dialog.close();
    }
  }, [link]);

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
      aria-labelledby="delete-link-title"
      className="modal"
    >
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h2
            id="delete-link-title"
            className="text-[24px] leading-[1.2] font-semibold tracking-[-0.3px] text-[var(--text)]"
          >
            링크를 삭제할까요?
          </h2>
          <p className="text-[17px] leading-[1.5] text-[var(--text-sub)]">
            <span className="font-medium text-[var(--text)]">
              {shown?.title}
            </span>{" "}
            링크가 목록에서 사라져요. 되돌릴 수 없어요.
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
              if (link) {
                onConfirm(link);
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
