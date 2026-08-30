"use client";

import { useState, type FormEvent } from "react";
import { FolderSelect } from "./folder-select";
import { useFolders } from "./folders-provider";
import { CheckIcon } from "./icons";
import { SaveButton } from "./save-button";
import { UrlInput } from "./url-input";
import { ALL_FOLDER_ID } from "@/app/lib/types";

type FieldErrors = {
  url?: string;
  folder?: string;
};

type SavedLink = {
  url: string;
  folderName: string;
};

function validateUrl(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "링크 주소를 입력해 주세요.";
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return "주소 형식이 올바르지 않아요. https:// 로 시작하는 주소를 넣어 주세요.";
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return "http 또는 https 주소만 담을 수 있어요.";
  }

  return undefined;
}

export function NewLinkForm() {
  const { folders } = useFolders();
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState<string>(ALL_FOLDER_ID);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState<SavedLink | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedFolder = folders.find((folder) => folder.id === folderId);
    const nextErrors: FieldErrors = {
      url: validateUrl(url),
      folder: selectedFolder ? undefined : "폴더를 선택해 주세요.",
    };
    setErrors(nextErrors);

    if (nextErrors.url || nextErrors.folder || !selectedFolder) {
      setSaved(null);
      return;
    }

    // 저장 API가 아직 없어 화면 피드백만 남기고 폼을 비웁니다.
    setSaved({ url: url.trim(), folderName: selectedFolder.name });
    setUrl("");
    setFolderId(ALL_FOLDER_ID);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="surface flex flex-col gap-5 p-6"
    >
      <UrlInput
        value={url}
        error={errors.url}
        onChange={(value) => {
          setUrl(value);
          setErrors((prev) => ({ ...prev, url: undefined }));
        }}
      />

      <FolderSelect
        folders={folders}
        value={folderId}
        error={errors.folder}
        onChange={(value) => {
          setFolderId(value);
          setErrors((prev) => ({ ...prev, folder: undefined }));
        }}
      />

      {saved ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-[10px] bg-[var(--fill)] px-4 py-3 text-[14px] leading-[1.4] text-[var(--success)]"
        >
          <CheckIcon className="mt-[3px] size-4 shrink-0" />
          <span>
            <span className="font-medium">{saved.folderName}</span> 폴더에
            담았어요. <span className="break-all">{saved.url}</span>
          </span>
        </p>
      ) : null}

      <div className="flex justify-end border-t border-[var(--divider)] pt-5">
        <SaveButton />
      </div>
    </form>
  );
}
