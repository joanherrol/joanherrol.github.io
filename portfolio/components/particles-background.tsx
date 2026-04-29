"use client";

import { useEffect, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions, Engine } from "@tsparticles/engine";

export function ParticlesBackground({ scrollFade }: { scrollFade?: boolean } = {}) {
  const [init, setInit] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouch(
      window.matchMedia("(hover: none) and (pointer: coarse)").matches,
    );
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  useEffect(() => {
    if (!scrollFade) return;
    const handleScroll = () => {
      if (!wrapperRef.current) return;
      const scrolled = window.scrollY;
      const vh = window.innerHeight;
      const opacity = Math.max(0, 1 - scrolled / (vh * 0.6));
      wrapperRef.current.style.opacity = String(opacity);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [init, scrollFade]);

  const options: ISourceOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: !isTouch, mode: "grab" },
        onClick: { enable: !isTouch, mode: "push" },
      },
      modes: {
        grab: { distance: 160, links: { opacity: 0.4 } },
        push: { quantity: 2 },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 140,
        enable: true,
        opacity: 0.1,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: "none",
        outModes: { default: "bounce" },
      },
      number: { value: 55, density: { enable: true } },
      opacity: { value: { min: 0.1, max: 0.25 } },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2 } },
    },
    detectRetina: true,
  };

  if (!init) return null;

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 -z-10 pointer-events-none"
    >
      <Particles
        id="tsparticles"
        className="absolute inset-0"
        options={options}
      />
    </div>
  );
}
