"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { FolderSelect } from "./folder-select";
import { useFolders } from "./folders-provider";
import { FormField, fieldClass } from "./form-field";
import { ALL_FOLDER_ID, type LinkItem } from "@/app/lib/types";
import type { LinkEdit } from "./links-provider";

const TITLE_FIELD_ID = "edit-link-title";
const DESCRIPTION_FIELD_ID = "edit-link-description";

type FieldErrors = {
  folder?: string;
  title?: string;
};

type EditLinkModalProps = {
  /** 수정 중인 링크. null이면 닫힌 상태입니다. */
  link: LinkItem | null;
  onClose: () => void;
  onSubmit: (link: LinkItem, changes: LinkEdit) => void;
};

/** 링크의 폴더·제목·설명만 고치는 모달. 주소와 썸네일은 그대로 둡니다. */
export function EditLinkModal({ link, onClose, onSubmit }: EditLinkModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { folders } = useFolders();
  const [folderId, setFolderId] = useState<string>(ALL_FOLDER_ID);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  // <dialog>의 열림 상태를 React 상태와 맞추고, 열릴 때 지금 값으로 폼을 채웁니다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (link && !dialog.open) {
      setFolderId(link.folderId);
      setTitle(link.title);
      setDescription(link.description);
      setErrors({});
      dialog.showModal();
    } else if (!link && dialog.open) {
      dialog.close();
    }
  }, [link]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!link) {
      return;
    }

    const trimmedTitle = title.trim();
    const nextErrors: FieldErrors = {
      folder: folders.some((folder) => folder.id === folderId)
        ? undefined
        : "폴더를 선택해 주세요.",
      title: trimmedTitle ? undefined : "제목을 입력해 주세요.",
    };
    setErrors(nextErrors);

    if (nextErrors.folder || nextErrors.title) {
      return;
    }

    onSubmit(link, {
      folderId,
      title: trimmedTitle,
      description: description.trim(),
    });
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
      aria-labelledby="edit-link-modal-title"
      className="modal"
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-6"
      >
        <h2
          id="edit-link-modal-title"
          className="text-[24px] leading-[1.2] font-semibold tracking-[-0.3px] text-[var(--text)]"
        >
          링크 수정
        </h2>

        <div className="flex flex-col gap-5">
          <FolderSelect
            folders={folders}
            value={folderId}
            error={errors.folder}
            onChange={(value) => {
              setFolderId(value);
              setErrors((prev) => ({ ...prev, folder: undefined }));
            }}
          />

          <FormField
            id={TITLE_FIELD_ID}
            label="제목"
            hint="카드에 크게 보이는 이름이에요."
            error={errors.title}
          >
            <input
              id={TITLE_FIELD_ID}
              name="title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={
                errors.title
                  ? `${TITLE_FIELD_ID}-error`
                  : `${TITLE_FIELD_ID}-hint`
              }
              className={fieldClass}
            />
          </FormField>

          <FormField
            id={DESCRIPTION_FIELD_ID}
            label="설명"
            hint="비워 두어도 괜찮아요."
          >
            <textarea
              id={DESCRIPTION_FIELD_ID}
              name="description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              aria-describedby={`${DESCRIPTION_FIELD_ID}-hint`}
              className={`${fieldClass} resize-none`}
            />
          </FormField>
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
