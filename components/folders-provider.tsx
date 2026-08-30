"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Folder } from "@/app/lib/types";

type FoldersContextValue = {
  folders: Folder[];
  /** 새 폴더를 만들고 만들어진 폴더를 돌려줍니다. */
  addFolder: (name: string) => Folder;
  /** 폴더 이름을 바꿉니다. */
  renameFolder: (folderId: string, name: string) => void;
  /** 폴더를 목록에서 지웁니다. 폴더에 담긴 링크는 그대로 둡니다. */
  removeFolder: (folderId: string) => void;
  /** 같은 이름의 폴더가 이미 있는지 확인합니다. 이름을 고치는 중이면 자기 자신은 빼고 봅니다. */
  hasFolderNamed: (name: string, exceptFolderId?: string) => boolean;
};

const FoldersContext = createContext<FoldersContextValue | null>(null);

/** 아직 이모지를 고르는 UI가 없어 새 폴더에는 기본 아이콘을 붙입니다. */
const DEFAULT_FOLDER_EMOJI = "📁";

type FoldersProviderProps = {
  /** 서버에서 내려준 기본 폴더 목록. */
  initialFolders: Folder[];
  children: ReactNode;
};

/**
 * 헤더의 새 폴더 모달과 사이드바가 같은 목록을 보도록 폴더 상태를 한곳에 둡니다.
 * 저장 API가 아직 없어 새 폴더는 새로고침하면 사라집니다.
 */
export function FoldersProvider({
  initialFolders,
  children,
}: FoldersProviderProps) {
  const [folders, setFolders] = useState(initialFolders);
  // 난수 대신 증가 번호를 써서 id가 매번 같은 순서로 만들어지게 합니다.
  const nextNumber = useRef(1);

  const addFolder = useCallback((name: string) => {
    const folder: Folder = {
      id: `user-${nextNumber.current}`,
      name: name.trim(),
      emoji: DEFAULT_FOLDER_EMOJI,
    };
    nextNumber.current += 1;
    setFolders((prev) => [...prev, folder]);
    return folder;
  }, []);

  const renameFolder = useCallback((folderId: string, name: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, name: name.trim() } : folder,
      ),
    );
  }, []);

  const removeFolder = useCallback((folderId: string) => {
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
