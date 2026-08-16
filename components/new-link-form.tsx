"use client";

import { useState, type FormEvent } from "react";
import { FolderSelect } from "./folder-select";
import { CheckIcon } from "./icons";
import { SaveButton } from "./save-button";
import { UrlInput } from "./url-input";
import { ALL_FOLDER_ID, type Folder } from "@/app/lib/types";

type NewLinkFormProps = {
  folders: Folder[];
};

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

export function NewLinkForm({ folders }: NewLinkFormProps) {
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
      className="flex max-w-2xl flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-5 md:p-6 dark:border-zinc-800 dark:bg-zinc-900/40"
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
          className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
          <CheckIcon className="mt-0.5 size-4 shrink-0" />
          <span>
            <span className="font-medium">{saved.folderName}</span> 폴더에
            담았어요. <span className="break-all">{saved.url}</span>
          </span>
        </p>
      ) : null}

      <div className="flex justify-end border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <SaveButton />
      </div>
    </form>
  );
}
