"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { useFolders } from "./folders-provider";
import { FormField, fieldClass } from "./form-field";

const NAME_FIELD_ID = "new-folder-name";

type NewFolderModalProps = {
  open: boolean;
  onClose: () => void;
};

export function NewFolderModal({ open, onClose }: NewFolderModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { addFolder, hasFolderNamed } = useFolders();
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();

  // <dialog>의 열림 상태를 React 상태와 맞춥니다. showModal()이 포커스 가둠과 Esc를 담당합니다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      setName("");
      setError(undefined);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError("폴더 이름을 입력해 주세요.");
      return;
    }
    if (hasFolderNamed(trimmed)) {
      setError("같은 이름의 폴더가 이미 있어요.");
      return;
    }

    addFolder(trimmed);
    onClose();
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
      aria-labelledby="new-folder-title"
      className="modal"
    >
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
        <h2
          id="new-folder-title"
          className="text-[24px] leading-[1.2] font-semibold tracking-[-0.3px] text-[var(--text)]"
        >
          새 폴더
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
            className="btn-primary px-6 py-3 text-[17px] leading-[1.5] font-medium"
          >
            저장
          </button>
        </div>
      </form>
    </dialog>
  );
}
