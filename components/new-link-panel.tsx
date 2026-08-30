import { NewLinkForm } from "./new-link-form";

export function NewLinkPanel() {
  return (
    <>
      <div className="mb-12">
        <h1 className="text-[40px] leading-[1.1] font-semibold tracking-[-0.5px] text-[var(--text)]">
          새 링크
        </h1>
        <p className="mt-4 text-[17px] leading-[1.5] text-[var(--text-sub)]">
          주소를 담고 폴더를 골라 저장하세요.
        </p>
      </div>

      <NewLinkForm />
    </>
  );
}
