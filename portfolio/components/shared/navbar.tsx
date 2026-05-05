"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useLocale } from "@/lib/i18n";

interface NavbarLink {
  id: string;
  label?: string;
}

type LabelGroup = "nav" | "proovit";

interface NavbarProps {
  leftType: "brand" | "back";
  brandText?: string;
  backTo?: string;
  links?: NavbarLink[];
  labelGroup?: LabelGroup;
  homeId?: string;
  homePath?: string;
  showMobileMenu?: boolean;
  initialActiveId?: string;
}

export function Navbar({
  leftType,
  brandText = "JH",
  backTo = "/",
  links = [],
  labelGroup,
  homeId,
  homePath,
  initialActiveId,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(
    initialActiveId ?? links[0]?.id ?? "",
  );
  const { locale, setLocale, t } = useLocale();
  const isScrollingRef = useRef(false);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getLabel = useCallback(
    (link: NavbarLink) => {
      if (link.label) return link.label;
      if (labelGroup === "nav") {
        return t.nav[link.id as keyof typeof t.nav] ?? link.id;
      }
      if (labelGroup === "proovit") {
        return (
          t.proovit.navSections[
            link.id as keyof typeof t.proovit.navSections
          ] ?? link.id
        );
      }
      return link.id;
    },
    [labelGroup, t.nav, t.proovit.navSections],
  );

  const getHashPath = useCallback(
    (id: string) => {
      if (homeId && homePath && id === homeId) {
        return homePath;
      }
      return `#${id}`;
    },
    [homeId, homePath],
  );

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;

      isScrollingRef.current = true;

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
      history.replaceState(null, "", getHashPath(id));
    },
    [getHashPath],
  );

  useEffect(() => {
    if (!links.length) return;

    const observers: IntersectionObserver[] = [];

    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveSection(id);
            history.replaceState(null, "", getHashPath(id));
          }
        },
        { threshold: 0.4 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [getHashPath, links]);

  useEffect(() => {
    if (!links.length) return;

    const hash = window.location.hash.replace("#", "");
    if (hash && links.some((l) => l.id === hash)) {
      setActiveSection(hash);
      document.getElementById(hash)?.scrollIntoView();
      return;
    }

    if (!hash && initialActiveId) {
      setActiveSection(initialActiveId);
    }
  }, [initialActiveId, links]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {leftType === "brand" ? (
          <button
            onClick={() => homeId && scrollToSection(homeId)}
            className="font-semibold text-sm tracking-tight cursor-pointer"
          >
            {brandText}
          </button>
        ) : (
          <Link
            href={backTo}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}

        {links.length > 0 && (
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToSection(l.id)}
                className={`text-sm transition-colors cursor-pointer ${
                  activeSection === l.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {getLabel(l)}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "en" ? "es" : "en")}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase cursor-pointer"
            aria-label="Toggle language"
          >
            {locale === "en" ? "ES" : "EN"}
          </button>
          {links.length > 0 && (
            <button
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {open && links.length > 0 && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  scrollToSection(l.id);
                  setOpen(false);
                }}
                className={`text-sm text-left transition-colors cursor-pointer ${
                  activeSection === l.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {getLabel(l)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
