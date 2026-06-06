"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavLinks } from "@/components/nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="text-bento-ink flex min-h-11 min-w-11 items-center justify-center"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {open ? (
        <nav
          id="mobile-nav-panel"
          className="border-bento-ink/20 absolute inset-x-0 top-full border-b bg-bento-bg px-4 py-4 shadow-sm"
        >
          <ul className="flex flex-col gap-1 text-base font-bold">
            <NavLinks variant="mobile" onNavigate={close} />
          </ul>
          <div className="mt-4">
            <LocaleSwitcher />
          </div>
        </nav>
      ) : null}
    </div>
  );
}
