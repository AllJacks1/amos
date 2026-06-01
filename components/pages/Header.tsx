"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/content": "Content",
  "/approvals": "Approvals",
  "/clients": "Clients",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  const match = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname.startsWith(`${path}/`),
  );
  return match?.[1] ?? "Dashboard";
}

export default function GlobalHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 hidden h-[60px] shrink-0 items-center",
        "border-b border-zinc-200/70 bg-white/75 px-6 backdrop-blur-xl",
        "lg:flex lg:px-8",
      )}
    >
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Workspace
        </p>
        <h1 className="truncate text-lg font-semibold tracking-tight text-zinc-900">
          {pageTitle}
        </h1>
      </div>
    </header>
  );
}
