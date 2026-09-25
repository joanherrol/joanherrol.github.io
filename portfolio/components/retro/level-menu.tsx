"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";
import { PixelIcon } from "@/components/retro/pixel-icon";
import { Player } from "@/components/retro/player";
import { dropdown, TitleBar } from "@/components/retro/ui";
import { useDismiss } from "@/components/retro/use-dismiss";

export type Level = { id: string; label: string; code: string };

export function LevelMenu({ levels }: { levels: Level[] }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  useEffect(() => {
    const update = () => {
      const middle = window.innerHeight / 2;
      let current = 0;
      levels.forEach((level, i) => {
        const el = document.getElementById(level.id);
        if (el && el.getBoundingClientRect().top <= middle) current = i;
      });
      setHovered(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [levels]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={rootRef}
      className="tone-light pointer-events-none fixed right-3 top-3 z-50 flex flex-col items-end bg-transparent!"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`${dropdown.trigger} gap-3 px-3 text-body uppercase tracking-widest`}
      >
        <PixelIcon name={open ? "close" : "menu"} size={2} />
        {copy.menu.open}
      </button>

      {open && (
        <nav
          aria-label={copy.menu.title}
          className={`${dropdown.panel} w-[22rem] max-w-[calc(100vw-1.5rem)] sm:w-[27rem]`}
        >
          <TitleBar title={copy.menu.title} />
          <ul>
            {levels.map((level, i) => (
              <li key={level.id}>
                <button
                  type="button"
                  onClick={() => go(level.id)}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  className={dropdown.item}
                >
                  <span className="flex w-[40px] shrink-0 justify-center">
                    {hovered === i && (
                      <Player animation="idle" scale={3} flipX />
                    )}
                  </span>
                  <span className="shrink-0 whitespace-nowrap">
                    {level.code}
                  </span>
                  {level.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
