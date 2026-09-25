"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.intersectionRatio > 0.1) {
            el.classList.add("is-revealed");
          } else if (!entry.isIntersecting) {
            el.classList.remove("is-revealed");
            el.dataset.revealFrom =
              entry.boundingClientRect.top < 0 ? "above" : "below";
          }
        }
      },
      { threshold: [0, 0.1] },
    );

    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el) => observer.observe(el));
    root.dataset.reveal = "on";

    return () => {
      observer.disconnect();
      delete root.dataset.reveal;
    };
  }, []);

  return null;
}
