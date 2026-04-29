"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/lib/i18n";

interface BackNavbarProps {
  backTo?: string;
}

export function BackNavbar({ backTo = "/" }: BackNavbarProps) {
  const { locale, setLocale } = useLocale();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href={backTo}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <button
          onClick={() => setLocale(locale === "en" ? "es" : "en")}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase cursor-pointer"
          aria-label="Toggle language"
        >
          {locale === "en" ? "ES" : "EN"}
        </button>
      </div>
    </header>
  );
}
