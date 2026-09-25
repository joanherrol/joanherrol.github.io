"use client";

import { useEffect } from "react";

export function SectionHash() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const sync = () => {
      const middle = window.innerHeight / 2;
      let id = "";
      for (const section of document.querySelectorAll("main > section")) {
        if (section.getBoundingClientRect().top <= middle) id = section.id;
      }
      const url = id && id !== "home" ? `#${id}` : window.location.pathname;
      if (url !== (window.location.hash || window.location.pathname)) {
        history.replaceState(history.state, "", url);
      }
    };

    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(sync, 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
