"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_PALETTE,
  PALETTES,
  PALETTE_STORAGE_KEY,
  applyPalette,
  type Palette,
} from "@/lib/palette";
import { copy } from "@/lib/copy";
import { PixelIcon } from "@/components/retro/pixel-icon";
import { dropdown, TitleBar } from "@/components/retro/ui";
import { useDismiss } from "@/components/retro/use-dismiss";

function readSaved(): Palette {
  try {
    const id = localStorage.getItem(PALETTE_STORAGE_KEY);
    return PALETTES.find((p) => p.id === id) ?? DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
}

function Swatch({ palette, size }: { palette: Palette; size: number }) {
  return (
    <span className="flex shrink-0 border-2 border-black" aria-hidden="true">
      {[palette.bg, palette.bg2, palette.accent].map((c) => (
        <span key={c} style={{ width: size, height: size, background: c }} />
      ))}
    </span>
  );
}

export function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(DEFAULT_PALETTE);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only
    setCurrent(readSaved());
  }, []);

  const choose = (p: Palette) => {
    setCurrent(p);
    setOpen(false);
    applyPalette(p);
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, p.id);
    } catch {}
  };

  return (
    <div
      ref={rootRef}
      className="tone-light pointer-events-none fixed left-3 top-3 z-50 flex flex-col items-start bg-transparent!"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${copy.menu.palette}: ${current.name}`}
        className={`${dropdown.trigger} px-2`}
      >
        <Swatch palette={current} size={12} />
      </button>

      {open && (
        <div className={`${dropdown.panel} w-max sm:w-[300px]`}>
          <TitleBar title={copy.menu.palette} />
          <ul>
            {PALETTES.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => choose(p)}
                  aria-pressed={p.id === current.id}
                  className={dropdown.item}
                >
                  <Swatch palette={p} size={14} />
                  {p.name}
                  <PixelIcon
                    name="check"
                    size={3}
                    className={`ml-auto ${p.id === current.id ? "" : "invisible"}`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
