"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";
import { PixelIcon } from "@/components/retro/pixel-icon";
import { Player } from "@/components/retro/player";
import { pixelCutRef } from "@/components/retro/pixel-corners";
import { dropdown, PixelShadow, TitleBar } from "@/components/retro/ui";
import { useDismiss } from "@/components/retro/use-dismiss";
import { useBasePx } from "@/lib/use-base-px";

type Level = { id: string; label: string; code: string };

export function LevelMenu({ levels }: Readonly<{ levels: Level[] }>) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const p = useBasePx();

  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  useEffect(() => {
    if (!open) return;
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
  }, [levels, open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={rootRef}
      className="tone-light pointer-events-none fixed right-[calc(var(--edge)+var(--safe-r))] top-[calc(var(--edge)+var(--safe-t))] z-50 flex flex-col items-end bg-transparent!"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-sound="open"
        aria-expanded={open}
        className={dropdown.trigger}
      >
        <PixelShadow />
        <span
          className={`${dropdown.triggerFace} gap-6 px-6 text-body uppercase tracking-[0.125em]`}
        >
          <PixelIcon name={open ? "close" : "menu"} />
          {copy.menu.open}
        </span>
      </button>

      {open && (
        <nav
          aria-label={copy.menu.title}
          ref={pixelCutRef}
          className={`${dropdown.panel} w-max max-w-[calc(100vw-var(--edge)*2)]`}
        >
          <PixelShadow />
          <div className={dropdown.panelFace}>
            <TitleBar title={copy.menu.title} divider />
            <ul>
              {levels.map((level, i) => (
                <li key={level.id}>
                  <button
                    type="button"
                    onClick={() => go(level.id)}
                    data-sound="start"
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    className={`${dropdown.item} ${hovered === i ? "bg-pico-accent text-cream" : ""}`}
                  >
                    <span className="flex h-11 w-10 shrink-0 items-center justify-center">
                      {hovered === i && p > 0 && (
                        <Player animation="idle" scale={p} flipX />
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
          </div>
        </nav>
      )}
    </div>
  );
}
