import { Logo } from "./logo";
import { NewFolderButton } from "./new-folder-button";
import { NewLinkButton } from "./new-link-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--divider)] bg-[var(--header-bg)] backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="mx-auto flex h-12 w-full max-w-[980px] items-center justify-between px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <NewFolderButton />
          <NewLinkButton />
        </div>
      </div>
    </header>
  );
}
