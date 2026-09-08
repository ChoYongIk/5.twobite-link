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
import type { LinkItem } from "@/app/lib/types";

/** 저장할 때 화면에서 채우는 값. id와 날짜는 여기서 붙입니다. */
export type NewLink = Omit<LinkItem, "id" | "createdAt">;

/** 수정 모달에서 고칠 수 있는 값. 주소·썸네일·태그는 건드리지 않습니다. */
export type LinkEdit = Pick<LinkItem, "folderId" | "title" | "description">;

type LinksContextValue = {
  links: LinkItem[];
  /** 새 링크를 목록 맨 앞에 넣고 만들어진 링크를 돌려줍니다. */
  addLink: (input: NewLink) => LinkItem;
  /** 링크의 폴더·제목·설명을 고칩니다. */
  updateLink: (linkId: string, changes: LinkEdit) => void;
  /** 링크를 목록에서 지웁니다. */
  removeLink: (linkId: string) => void;
};

const LinksContext = createContext<LinksContextValue | null>(null);

function formatToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}.${month}.${day}`;
}

type LinksProviderProps = {
  /** 서버에서 내려준 기본 링크 목록. */
  initialLinks: LinkItem[];
  children: ReactNode;
};

/**
 * 새 링크 폼과 목록·사이드바가 같은 링크를 보도록 상태를 한곳에 둡니다.
 * 저장 API가 아직 없어 새 링크는 새로고침하면 사라집니다.
 */
export function LinksProvider({ initialLinks, children }: LinksProviderProps) {
  const [links, setLinks] = useState(initialLinks);
  // 난수 대신 증가 번호를 써서 id가 매번 같은 순서로 만들어지게 합니다.
  const nextNumber = useRef(1);

  const addLink = useCallback((input: NewLink) => {
    const link: LinkItem = {
      ...input,
      id: `user-link-${nextNumber.current}`,
      createdAt: formatToday(),
    };
    nextNumber.current += 1;
    setLinks((prev) => [link, ...prev]);
    return link;
  }, []);

  const updateLink = useCallback((linkId: string, changes: LinkEdit) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === linkId ? { ...link, ...changes } : link)),
    );
  }, []);

  const removeLink = useCallback((linkId: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== linkId));
  }, []);

  const value = useMemo(
    () => ({ links, addLink, updateLink, removeLink }),
    [links, addLink, updateLink, removeLink],
  );

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  const value = useContext(LinksContext);

  if (!value) {
    throw new Error("useLinks는 LinksProvider 안에서만 쓸 수 있어요.");
  }

  return value;
}
