"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";
import {
  Player,
  usePlayerSpritePreload,
  useShoot,
} from "@/components/retro/player";

// One art pixel per font pixel.
function useHeroScale() {
  const [scale, setScale] = useState(11);
  useEffect(() => {
    const update = () => {
      const fontSize = Math.min(88, Math.max(36, window.innerWidth * 0.08));
      setScale(Math.round(fontSize / 8));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

export function Hero() {
  const scale = useHeroScale();
  usePlayerSpritePreload();
  const { shooting, bullets, shoot } = useShoot();

  return (
    <section
      id="home"
      className="tone-dark section-paper relative flex min-h-screen-band flex-col overflow-hidden px-4 pb-(--band) pt-18 sm:px-7 lg:px-12"
    >
      {/* Puts the name at 52% of the screen. */}
      <div className="flex-[1.07_1_0%]" />
      {/* The subtitle (w-0 min-w-full) wraps within the name's width. */}
      <div className="mx-auto flex w-fit flex-col items-center text-center">
        <h1 className="text-drop text-left font-pixel text-[length:round(clamp(2.25rem,8vw,5.5rem),8px)] uppercase leading-none">
          <span className="block px-[0.15em]">Joan</span>
          <span className="text-mark relative mt-[0.125em] inline-block px-[0.15em] pt-[0.125em]">
            <button
              type="button"
              onClick={shoot}
              className="absolute bottom-full cursor-pointer"
              style={{ right: `calc(0.15em + ${scale}px)` }}
              aria-label={copy.hero.playerLabel}
            >
              <Player
                animation="idle"
                flipX
                dropShadow
                scale={scale}
                shooting={shooting}
                bullets={bullets}
                shadow={false}
                label={copy.hero.playerLabel}
              />
            </button>
            <span className="relative z-10">Hervás</span>
          </span>
        </h1>
        <p className="mt-7 w-0 min-w-full text-large uppercase tracking-[0.2em] text-balance">
          {copy.hero.subtitle}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center text-large uppercase">
        <a href="#about" className="blink hover:text-pop">
          {copy.hero.start}
        </a>
      </div>
    </section>
  );
}
