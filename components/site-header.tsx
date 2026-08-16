import { Logo } from "./logo";
import { NewLinkButton } from "./new-link-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Logo />
        <NewLinkButton />
      </div>
    </header>
  );
}
