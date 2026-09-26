"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const STAGGER_MS = 80;
const REVEAL_AT = 0.15;

export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Blocks arriving together follow each other, top first.
        const shown = entries
          .filter((e) => e.intersectionRatio >= REVEAL_AT)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        shown.forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = `${i * STAGGER_MS}ms`;
          el.classList.add("is-revealed");
        });
        // Hide only once fully off screen, so nothing vanishes in view.
        for (const entry of entries) {
          if (entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = "";
          el.classList.remove("is-revealed");
          el.dataset.revealFrom =
            entry.boundingClientRect.top < 0 ? "above" : "below";
        }
      },
      { threshold: [0, REVEAL_AT] },
    );

    const elements =
      document.querySelectorAll<HTMLElement>("body [data-reveal]");
    elements.forEach((el) => observer.observe(el));
    root.dataset.reveal = "on";

    // Zooming can move blocks into view without an observer callback. Only
    // width changes count: mobile toolbars resize the height mid-scroll.
    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      for (const el of elements) {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          el.classList.add("is-revealed");
        }
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      delete root.dataset.reveal;
    };
  }, []);

  return null;
}
