"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { useFolders } from "./folders-provider";
import { FormField, fieldClass } from "./form-field";
import type { Folder } from "@/app/lib/types";

const NAME_FIELD_ID = "folder-name";

type FolderNameModalProps = {
  open: boolean;
  title: string;
  /** 이름을 고치는 중인 폴더. 새 폴더를 만들 때는 넘기지 않습니다. */
  folder?: Folder | null;
  onClose: () => void;
  /** 저장을 처리합니다. Promise를 돌려주면 끝날 때까지 저장 버튼을 잠급니다. */
  onSubmit: (name: string) => void | Promise<void>;
};

/** 폴더 이름을 입력받는 모달. 새 폴더 만들기와 이름 수정이 함께 씁니다. */
export function FolderNameModal({
  open,
  title,
  folder,
  onClose,
  onSubmit,
}: FolderNameModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { hasFolderNamed } = useFolders();
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();
  // 저장이 끝나기 전에 다시 눌러도 폴더가 두 번 만들어지지 않게 막습니다.
  // 상태 갱신은 다음 렌더에야 반영되므로 같은 틱의 연타는 ref로 걸러냅니다.
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // <dialog>의 열림 상태를 React 상태와 맞춥니다. showModal()이 포커스 가둠과 Esc를 담당합니다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      setName(folder?.name ?? "");
      setError(undefined);
      setSubmitting(false);
      submittingRef.current = false;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, folder]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    const trimmed = name.trim();
    if (!trimmed) {
      setError("폴더 이름을 입력해 주세요.");
      return;
    }
    if (hasFolderNamed(trimmed, folder?.id)) {
      setError("같은 이름의 폴더가 이미 있어요.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
    } catch {
      setError("폴더를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // 패널 바깥(백드롭)을 누르면 닫습니다. 패널 안쪽 클릭은 form이 받습니다.
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
      aria-labelledby="folder-name-title"
      className="modal"
    >
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
        <h2
          id="folder-name-title"
          className="text-[24px] leading-[1.2] font-semibold tracking-[-0.3px] text-[var(--text)]"
        >
          {title}
        </h2>

        <FormField
          id={NAME_FIELD_ID}
          label="폴더 이름"
          hint="사이드바에 표시될 이름이에요."
          error={error}
        >
          <input
            id={NAME_FIELD_ID}
            name="name"
            type="text"
            autoComplete="off"
            placeholder="예) 주말에 읽기"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(undefined);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${NAME_FIELD_ID}-error` : `${NAME_FIELD_ID}-hint`
            }
            className={fieldClass}
          />
        </FormField>

        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-4 py-3 text-[17px] leading-[1.5] font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting || undefined}
            className="btn-primary px-6 py-3 text-[17px] leading-[1.5] font-medium"
          >
            {submitting ? "저장 중…" : "저장"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
