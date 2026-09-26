"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export type SpriteSheet = {
  src: string;
  frameWidth: number;
  frameHeight: number;
  frames: number;
  fps?: number;
};

type PixelSpriteProps = {
  sheet: SpriteSheet;
  scale?: number;
  playing?: boolean;
  loop?: boolean;
  startFrame?: number;
  flipX?: boolean;
  tint?: string;
  fps?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

const TINT_ALPHA = 0.7;
// A frame may draw this early, so the refresh nearest its due time takes it.
const EARLY_MS = 8;

const imageCache = new Map<string, Promise<HTMLImageElement>>();
const loadedImages = new Map<string, HTMLImageElement>();

function loadImage(src: string) {
  let promise = imageCache.get(src);
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img
        .decode()
        .then(() => {
          loadedImages.set(src, img);
          resolve(img);
        })
        .catch(reject);
    });
    imageCache.set(src, promise);
  }
  return promise;
}

export function preloadSprites(sheets: SpriteSheet[]) {
  for (const { src } of sheets) loadImage(src).catch(() => {});
}

export function preloadSpritesWhenIdle(sheets: SpriteSheet[]) {
  const run = () => preloadSprites(sheets);
  if ("requestIdleCallback" in window) requestIdleCallback(run);
  else setTimeout(run, 200);
}

// Draws each art pixel as a whole block of device pixels, crisp at any scale.
export function PixelSprite({
  sheet,
  scale = 4,
  playing = true,
  loop = true,
  startFrame = 0,
  flipX = false,
  tint,
  fps,
  label,
  className,
  style,
}: Readonly<PixelSpriteProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flipRef = useRef(flipX);
  const tintRef = useRef(tint);
  const redrawRef = useRef<() => void>(() => {});

  const { src, frameWidth: w, frameHeight: h, frames } = sheet;
  const rate = fps ?? sheet.fps ?? 12;

  useEffect(() => {
    flipRef.current = flipX;
    tintRef.current = tint;
    redrawRef.current();
  }, [flipX, tint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let img: HTMLImageElement | null = null;
    let frame = startFrame % frames;
    let last = 0;
    let raf = 0;
    let wake = 0;
    let cancelled = false;
    let blockSize = 1;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      blockSize = Math.max(1, Math.round(scale * dpr));
      canvas.width = w * blockSize;
      canvas.height = h * blockSize;
      // Whole device pixels per art pixel, even at fractional zoom.
      canvas.style.width = `${canvas.width / dpr}px`;
      canvas.style.height = `${canvas.height / dpr}px`;
    };

    const draw = () => {
      if (!img) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      if (flipRef.current) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(
        img,
        frame * w,
        0,
        w,
        h,
        0,
        0,
        w * blockSize,
        h * blockSize,
      );
      if (tintRef.current) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = "source-atop";
        ctx.globalAlpha = TINT_ALPHA;
        ctx.fillStyle = tintRef.current;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }
    };
    redrawRef.current = draw;

    // Fixed steps keep frames in sync with timers set from the frame rate.
    // Sleeps between frames instead of waking on every display refresh.
    const step = 1000 / rate;
    const tick = (t: number) => {
      raf = 0;
      if (last === 0 || t - last > step * frames) last = t;
      if (t - last >= step - EARLY_MS) {
        if (!loop && frame === frames - 1) return;
        frame = (frame + 1) % frames;
        last += step;
        draw();
      }
      wake = window.setTimeout(
        () => {
          wake = 0;
          raf = requestAnimationFrame(tick);
        },
        Math.max(0, last + step - EARLY_MS - performance.now()),
      );
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      clearTimeout(wake);
      raf = 0;
      wake = 0;
    };

    const animates = playing && frames > 1 && !prefersReducedMotion();
    let onScreen = true;
    const start = () => {
      if (raf || wake || !img || !animates || !onScreen) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    observer.observe(canvas);

    const show = (loaded: HTMLImageElement) => {
      img = loaded;
      resize();
      draw();
      start();
    };
    const ready = loadedImages.get(src);
    if (ready) show(ready);
    else
      loadImage(src).then((loaded) => {
        if (!cancelled) show(loaded);
      });

    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      observer.disconnect();
      stop();
      window.removeEventListener("resize", onResize);
      redrawRef.current = () => {};
    };
  }, [src, w, h, frames, rate, scale, playing, loop, startFrame]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={className}
        style={{
          width: w * scale,
          height: h * scale,
          imageRendering: "pixelated",
          display: "block",
          ...style,
        }}
      />
      {label && <span className="sr-only">{label}</span>}
    </>
  );
}
