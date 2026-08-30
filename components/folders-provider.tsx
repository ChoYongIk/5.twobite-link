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
  /** 같은 이름의 폴더가 이미 있는지 확인합니다. */
  hasFolderNamed: (name: string) => boolean;
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

  const hasFolderNamed = useCallback(
    (name: string) => folders.some((folder) => folder.name === name.trim()),
    [folders],
  );

  const value = useMemo(
    () => ({ folders, addFolder, hasFolderNamed }),
    [folders, addFolder, hasFolderNamed],
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
