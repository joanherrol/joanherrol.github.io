"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const SETTLE_MS = 160;
const THRESHOLD = 0.08;

export function SoftSnap() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let snapping = false;
    const smooth = !prefersReducedMotion();

    const settle = () => {
      if (snapping) {
        snapping = false;
        return;
      }
      const limit = window.innerHeight * THRESHOLD;
      let nearest = Infinity;
      for (const section of document.querySelectorAll("main > section")) {
        const top = section.getBoundingClientRect().top;
        if (Math.abs(top) < Math.abs(nearest)) nearest = top;
      }
      if (Math.abs(nearest) < 1 || Math.abs(nearest) > limit) return;
      snapping = true;
      window.scrollTo({
        top: window.scrollY + nearest,
        behavior: smooth ? "smooth" : "auto",
      });
    };

    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(settle, SETTLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
