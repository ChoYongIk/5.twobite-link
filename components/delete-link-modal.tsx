"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { LinkItem } from "@/app/lib/types";

type DeleteLinkModalProps = {
  /** 삭제를 확인할 링크. null이면 닫힌 상태입니다. */
  link: LinkItem | null;
  onClose: () => void;
  /** 삭제를 처리합니다. Promise를 돌려주면 끝날 때까지 삭제 버튼을 잠급니다. */
  onConfirm: (link: LinkItem) => void | Promise<void>;
};

export function DeleteLinkModal({
  link,
  onClose,
  onConfirm,
}: DeleteLinkModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // 닫히는 0.3초 동안 제목이 사라지지 않도록 마지막 링크를 붙들어 둡니다.
  const [shown, setShown] = useState<LinkItem | null>(link);

  const [error, setError] = useState<string>();
  // 삭제가 끝나기 전에 다시 눌러도 두 번 지우지 않게 막습니다.
  // 상태 갱신은 다음 렌더에야 반영되므로 같은 틱의 연타는 ref로 걸러냅니다.
  const [deleting, setDeleting] = useState(false);
  const deletingRef = useRef(false);

  if (link && link !== shown) {
    setShown(link);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (link && !dialog.open) {
      setError(undefined);
      setDeleting(false);
      deletingRef.current = false;
      dialog.showModal();
    } else if (!link && dialog.open) {
      dialog.close();
    }
  }, [link]);

  const handleConfirm = async () => {
    if (!link || deletingRef.current) {
      return;
    }

    deletingRef.current = true;
    setDeleting(true);
    setError(undefined);
    try {
      await onConfirm(link);
    } catch {
      setError("링크를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
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
