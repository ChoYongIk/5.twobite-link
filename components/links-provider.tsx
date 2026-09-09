"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toLinkItem, type LinkRow } from "@/app/lib/links";
import type { LinkItem } from "@/app/lib/types";
import { createClient } from "@/utils/supabase/client";

/** 저장할 때 화면에서 채우는 값. id와 날짜는 여기서 붙입니다. */
export type NewLink = Omit<LinkItem, "id" | "createdAt">;

/** 수정 모달에서 고칠 수 있는 값. 주소·썸네일·태그는 건드리지 않습니다. */
export type LinkEdit = Pick<LinkItem, "folderId" | "title" | "description">;

type LinksContextValue = {
  links: LinkItem[];
  /** links 테이블에 새 링크를 저장하고 목록 맨 앞에 넣은 뒤 돌려줍니다. 실패하면 throw합니다. */
  addLink: (input: NewLink) => Promise<LinkItem>;
  /** links 테이블의 폴더·제목·설명을 고치고 화면 목록에도 반영합니다. 실패하면 throw합니다. */
  updateLink: (linkId: string, changes: LinkEdit) => Promise<void>;
  /** links 테이블에서 링크를 지우고 화면 목록에서도 뺍니다. 실패하면 throw합니다. */
  removeLink: (linkId: string) => Promise<void>;
};

const LinksContext = createContext<LinksContextValue | null>(null);

type LinksProviderProps = {
  /** 서버에서 links 테이블을 읽어 내려준 링크 목록. */
  initialLinks: LinkItem[];
  children: ReactNode;
};

/**
 * 새 링크 폼과 목록·사이드바가 같은 링크를 보도록 상태를 한곳에 둡니다.
 * 목록은 서버가 links 테이블에서 읽어 내려주고, 추가·수정·삭제는 테이블에 반영된 뒤 여기서 갱신합니다.
 */
export function LinksProvider({ initialLinks, children }: LinksProviderProps) {
  const [links, setLinks] = useState(initialLinks);

  const addLink = useCallback(async (input: NewLink) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("links")
      .insert({
        url: input.url,
        title: input.title,
        // 비어 있는 설명·썸네일은 빈 문자열 대신 NULL로 둡니다.
        description: input.description || null,
        thumbnail_url: input.thumbnail || null,
        folder_id: Number(input.folderId),
      })
      .select("id, url, title, description, thumbnail_url, folder_id, created_at")
      .single<LinkRow>();

    if (error) {
      throw new Error(error.message);
    }

    const link = toLinkItem(data);
    setLinks((prev) => [link, ...prev]);
    return link;
  }, []);

  const updateLink = useCallback(async (linkId: string, changes: LinkEdit) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("links")
      .update({
        folder_id: Number(changes.folderId),
        title: changes.title,
        // 비어 있는 설명은 빈 문자열 대신 NULL로 둡니다.
        description: changes.description || null,
      })
      .eq("id", Number(linkId))
      .select("id, url, title, description, thumbnail_url, folder_id, created_at")
      .single<LinkRow>();

    if (error) {
      throw new Error(error.message);
    }

    // DB가 저장한 값을 그대로 쓰면 화면과 테이블이 어긋나지 않습니다.
    const updated = toLinkItem(data);
    setLinks((prev) =>
      prev.map((link) =>
        link.id === updated.id
          ? {
              ...link,
              folderId: updated.folderId,
              title: updated.title,
              description: updated.description,
            }
          : link,
      ),
    );
  }, []);

  const removeLink = useCallback(async (linkId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", Number(linkId));

    if (error) {
      throw new Error(error.message);
    }

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
