"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/lib/i18n";

const linkKeys = [
  "home",
  "about",
  "projects",
  "skills",
  "education",
  "contact",
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();

  const links = linkKeys.map((key) => ({
    href: key,
    label: t.nav[key],
  }));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo("home")}
          className="font-semibold text-sm tracking-tight"
        >
          JH
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "en" ? "es" : "en")}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase"
            aria-label="Toggle language"
          >
            {locale === "en" ? "ES" : "EN"}
          </button>
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => {
                  scrollTo(l.href);
                  setOpen(false);
                }}
                className="text-sm text-left text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
