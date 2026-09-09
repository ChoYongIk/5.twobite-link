"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toFolder, type FolderRow } from "@/app/lib/folders";
import type { Folder } from "@/app/lib/types";
import { createClient } from "@/utils/supabase/client";

type FoldersContextValue = {
  folders: Folder[];
  /** folders 테이블에 새 폴더를 저장하고 만들어진 폴더를 돌려줍니다. 실패하면 throw합니다. */
  addFolder: (name: string) => Promise<Folder>;
  /** folders 테이블의 폴더 이름을 고치고 화면 목록에도 반영합니다. 실패하면 throw합니다. */
  renameFolder: (folderId: string, name: string) => Promise<void>;
  /**
   * folders 테이블에서 폴더를 지우고 화면 목록에서도 뺍니다. 실패하면 throw합니다.
   * links.folder_id는 ON DELETE SET NULL이라 담긴 링크는 남습니다.
   */
  removeFolder: (folderId: string) => Promise<void>;
  /** 같은 이름의 폴더가 이미 있는지 확인합니다. 이름을 고치는 중이면 자기 자신은 빼고 봅니다. */
  hasFolderNamed: (name: string, exceptFolderId?: string) => boolean;
};

const FoldersContext = createContext<FoldersContextValue | null>(null);

type FoldersProviderProps = {
  /** 서버에서 folders 테이블을 읽어 내려준 폴더 목록. */
  initialFolders: Folder[];
  children: ReactNode;
};

/**
 * 헤더의 새 폴더 모달과 사이드바가 같은 목록을 보도록 폴더 상태를 한곳에 둡니다.
 * 폴더 추가·이름 수정·삭제는 모두 folders 테이블에 반영된 뒤 화면 목록을 갱신합니다.
 */
export function FoldersProvider({
  initialFolders,
  children,
}: FoldersProviderProps) {
  const [folders, setFolders] = useState(initialFolders);

  const addFolder = useCallback(async (name: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("folders")
      .insert({ name: name.trim() })
      .select("id, name")
      .single<FolderRow>();

    if (error) {
      throw new Error(error.message);
    }

    const folder = toFolder(data);
    setFolders((prev) => [...prev, folder]);
    return folder;
  }, []);

  const renameFolder = useCallback(async (folderId: string, name: string) => {
    const trimmed = name.trim();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("folders")
      .update({ name: trimmed })
      .eq("id", Number(folderId))
      .select("id, name")
      .single<FolderRow>();

    if (error) {
      throw new Error(error.message);
    }

    // DB가 저장한 값을 그대로 쓰면 화면과 테이블이 어긋나지 않습니다.
    const renamed = toFolder(data);
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === renamed.id ? { ...folder, name: renamed.name } : folder,
      ),
    );
  }, []);

  const removeFolder = useCallback(async (folderId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", Number(folderId));

    if (error) {
      throw new Error(error.message);
    }

    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
  }, []);

  const hasFolderNamed = useCallback(
    (name: string, exceptFolderId?: string) =>
      folders.some(
        (folder) =>
          folder.id !== exceptFolderId && folder.name === name.trim(),
      ),
    [folders],
  );

  const value = useMemo(
    () => ({ folders, addFolder, renameFolder, removeFolder, hasFolderNamed }),
    [folders, addFolder, renameFolder, removeFolder, hasFolderNamed],
  );

  return (
    <FoldersContext.Provider value={value}>{children}</FoldersContext.Provider>
  );
}

export function useFolders() {
  const value = useContext(FoldersContext);

  if (!value) {
    throw new Error("useFolders는 FoldersProvider 안에서만 쓸 수 있어요.");
  }

  return value;
}
