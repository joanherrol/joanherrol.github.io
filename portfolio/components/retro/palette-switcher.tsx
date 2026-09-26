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
import { dropdown, PixelArt, TitleBar } from "@/components/retro/ui";
import { useDismiss } from "@/components/retro/use-dismiss";
import { SoundToggle } from "@/components/retro/sound-toggle";
import { playSound } from "@/lib/sound";

function readSaved(): Palette {
  try {
    const id = localStorage.getItem(PALETTE_STORAGE_KEY);
    return PALETTES.find((p) => p.id === id) ?? DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
}

const CHIPS = Array.from({ length: 6 }, () => "bbbbbb#gggggg#aaaaaa");

function Swatch({ palette }: Readonly<{ palette: Palette }>) {
  return (
    <PixelArt
      rows={CHIPS}
      colors={{
        b: palette.bg,
        g: palette.bg2,
        a: palette.accent,
        "#": "var(--pico-black)",
      }}
      className="box-content w-[2.5em] shrink-0 border-(length:--text-px) border-black"
    />
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
    playSound("ui");
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
      className="tone-light pointer-events-none fixed left-3 top-3 z-50 flex items-start gap-3 bg-transparent!"
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpen((o) => !o);
            playSound("ui");
          }}
          aria-expanded={open}
          aria-label={`${copy.menu.palette}: ${current.name}`}
          className={`${dropdown.trigger} px-2 text-body`}
        >
          <Swatch palette={current} />
        </button>

        {open && (
          <div
            className={`${dropdown.panel} absolute left-0 top-full w-max sm:w-[300px]`}
          >
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
                    <Swatch palette={p} />
                    {p.name}
                    <PixelIcon
                      name="check"
                      className={`ml-auto ${p.id === current.id ? "" : "invisible"}`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <SoundToggle />
    </div>
  );
}
