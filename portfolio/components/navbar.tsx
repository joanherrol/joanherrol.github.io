"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const { locale, setLocale, t } = useLocale();
  const isScrollingRef = useRef(false);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const links = linkKeys.map((key) => ({
    href: key,
    label: t.nav[key],
  }));

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Mark programmatic scroll start
    isScrollingRef.current = true;

    // Detect scroll end: 150ms of silence after last scroll event
    const handleScroll = () => {
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        window.removeEventListener("scroll", handleScroll);
      }, 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    el.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
  }, []);

  // Update URL hash as sections scroll into view during manual scroll
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    linkKeys.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveSection(id);
            history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
          }
        },
        { threshold: 0.4 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // On mount, scroll to hash if present
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      document.getElementById(hash)?.scrollIntoView();
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollToSection("home")}
          className="font-semibold text-sm tracking-tight cursor-pointer"
        >
          JH
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollToSection(l.href)}
              className={`text-sm transition-colors cursor-pointer ${
                activeSection === l.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "en" ? "es" : "en")}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase cursor-pointer"
            aria-label="Toggle language"
          >
            {locale === "en" ? "ES" : "EN"}
          </button>
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                  scrollToSection(l.href);
                  setOpen(false);
                }}
                className={`text-sm text-left transition-colors cursor-pointer ${
                  activeSection === l.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
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
