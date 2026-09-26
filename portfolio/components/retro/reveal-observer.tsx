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

    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    elements.forEach((el) => observer.observe(el));
    root.dataset.reveal = "on";

    // Zooming can move blocks into view without an observer callback.
    const onResize = () => {
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
