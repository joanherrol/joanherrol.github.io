"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { copy } from "@/lib/copy";
import { playSound } from "@/lib/sound";
import {
  Player,
  usePlayerSpritePreload,
  useShoot,
} from "@/components/retro/player";

// The player is drawn at the title's font pixel, which CSS picks.
function useFontPixel(ref: RefObject<HTMLElement | null>) {
  const [px, setPx] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (el) setPx(Number.parseFloat(getComputedStyle(el).fontSize) / 8);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);
  return px;
}

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scale = useFontPixel(titleRef);
  usePlayerSpritePreload();
  const { shooting, bullets, shoot } = useShoot();
  const fire = () => {
    if (shoot() !== null) playSound("shot");
  };

  return (
    <section
      id="home"
      className="tone-dark section-paper relative flex min-h-screen-band flex-col overflow-hidden px-8 pb-(--band) pt-28 sm:px-14 lg:px-24"
    >
      {/* Puts the name at 52% of the screen. */}
      <div className="flex-[1.07_1_0%]" />
      {/* The subtitle (w-0 min-w-full) wraps within the name's width. */}
      <div className="mx-auto flex w-fit flex-col items-center text-center">
        <h1
          ref={titleRef}
          className="relative text-left type-display-md [--s:0.125em]"
        >
          <span aria-hidden="true" className="drop-copy">
            <span className="block px-[0.125em]">Joan</span>
            <span className="text-mark mt-[0.125em] inline-block px-[0.125em] pt-[0.125em]">
              Hervás
            </span>
          </span>
          <span className="block px-[0.125em]">Joan</span>
          <span className="text-mark relative mt-[0.125em] inline-block px-[0.125em] pt-[0.125em]">
            <button
              type="button"
              onClick={fire}
              className="absolute bottom-full cursor-pointer"
              style={{ right: `calc(0.125em + ${scale}px)` }}
              aria-label={copy.hero.playerLabel}
            >
              {scale > 0 && (
                <Player
                  animation="idle"
                  flipX
                  scale={scale}
                  shooting={shooting}
                  bullets={bullets}
                  shadow={false}
                  label={copy.hero.playerLabel}
                />
              )}
            </button>
            <span className="relative z-10">Hervás</span>
          </span>
        </h1>
        <p className="mt-14 w-0 min-w-full type-body-lg uppercase tracking-[0.25em] text-balance">
          {copy.hero.subtitle}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center type-body-lg uppercase tracking-[0.125em]">
        <a href="#about" data-sound="start" className="blink hover:text-pop">
          {copy.hero.start}
        </a>
      </div>
    </section>
  );
}
