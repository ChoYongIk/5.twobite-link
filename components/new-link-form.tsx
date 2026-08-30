"use client";

import { useState, type FormEvent } from "react";
import { FolderSelect } from "./folder-select";
import { useFolders } from "./folders-provider";
import { CheckIcon } from "./icons";
import { useLinks } from "./links-provider";
import { SaveButton } from "./save-button";
import { UrlInput } from "./url-input";
import { ALL_FOLDER_ID } from "@/app/lib/types";

type FieldErrors = {
  url?: string;
  folder?: string;
};

type SavedLink = {
  title: string;
  folderName: string;
  /** 오픈 그래프를 못 읽어 주소만 저장했는지 여부. */
  partial: boolean;
};

type OpenGraph = {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
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

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** 오픈 그래프 API로 제목·설명·썸네일을 받아 옵니다. 실패하면 null입니다. */
async function fetchOpenGraph(url: string): Promise<OpenGraph | null> {
  try {
    const response = await fetch("/api/og", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as OpenGraph;
  } catch {
    return null;
  }
}

export function NewLinkForm() {
  const { folders } = useFolders();
  const { addLink } = useLinks();
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState<string>(ALL_FOLDER_ID);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState<SavedLink | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    const trimmedUrl = url.trim();
    setPending(true);
    setSaved(null);

    const openGraph = await fetchOpenGraph(trimmedUrl);
    // 정보를 못 읽어도 링크 자체는 잃지 않도록 주소로 최소한을 채웁니다.
    const title = openGraph?.title?.trim() || hostnameOf(trimmedUrl);

    addLink({
      title,
      description: openGraph?.description?.trim() ?? "",
      url: openGraph?.url ?? trimmedUrl,
      folderId: selectedFolder.id,
      tags: [],
      thumbnail: openGraph?.image,
    });

    setSaved({
      title,
      folderName: selectedFolder.name,
      partial: openGraph === null,
    });
    setUrl("");
    setFolderId(ALL_FOLDER_ID);
    setPending(false);
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
            <span className="font-medium">{saved.folderName}</span> 폴더에{" "}
            <span className="font-medium">{saved.title}</span> 을(를) 담았어요.
            {saved.partial
              ? " 페이지 정보를 읽지 못해 주소만 저장했어요."
              : null}
          </span>
        </p>
      ) : null}

      <div className="flex justify-end border-t border-[var(--divider)] pt-5">
        <SaveButton pending={pending} />
      </div>
    </form>
  );
}
