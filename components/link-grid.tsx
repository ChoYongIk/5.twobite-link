"use client";

import { useState } from "react";
import { DeleteLinkModal } from "./delete-link-modal";
import { EditLinkModal } from "./edit-link-modal";
import { LinkCard } from "./link-card";
import { useLinks, type LinkEdit } from "./links-provider";
import type { LinkItem } from "@/app/lib/types";

export function LinkGrid({ links }: { links: LinkItem[] }) {
  const { updateLink, removeLink } = useLinks();
  const [linkToEdit, setLinkToEdit] = useState<LinkItem | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<LinkItem | null>(null);

  const handleSubmitEdit = async (link: LinkItem, changes: LinkEdit) => {
    // 저장이 실패하면 모달이 오류를 보여 주도록 닫지 않고 그대로 던집니다.
    await updateLink(link.id, changes);
    setLinkToEdit(null);
  };

  const handleConfirmDelete = async (link: LinkItem) => {
    // 삭제가 실패하면 모달이 오류를 보여 주도록 닫지 않고 그대로 던집니다.
    await removeLink(link.id);
    setLinkToDelete(null);
  };

  // 썸네일 유무로 카드 높이가 달라서, 늘리지 않고 내용만큼만 차지하게 둡니다.
  return (
    <>
      <ul className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.id}>
            <LinkCard
              link={link}
              onEdit={() => setLinkToEdit(link)}
              onDelete={() => setLinkToDelete(link)}
            />
          </li>
        ))}
      </ul>

      <EditLinkModal
        link={linkToEdit}
        onClose={() => setLinkToEdit(null)}
        onSubmit={handleSubmitEdit}
      />

      <DeleteLinkModal
        link={linkToDelete}
        onClose={() => setLinkToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
