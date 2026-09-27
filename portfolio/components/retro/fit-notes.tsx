"use client";

import { useEffect, useRef } from "react";

// Marks its section data-crowded when optional notes would push it past one screen.
export function FitNotes() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const fit = () => {
      delete section.dataset.crowded;
      const limit = Number.parseFloat(getComputedStyle(section).minHeight);
      if (section.getBoundingClientRect().height > limit + 0.5)
        section.dataset.crowded = "";
    };
    fit();
    document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return <span ref={ref} hidden />;
}
