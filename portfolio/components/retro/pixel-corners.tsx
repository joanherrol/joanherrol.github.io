"use client";

import { useEffect } from "react";

/** One more corner step per this many shadow pixels of the shorter side. */
const STEP_SIDE = 12;
/** Surfaces stop at this many steps; only `data-cut-free` ones (the console) keep growing. */
const MAX_STEPS = 2;
const SELECTOR = ".pixel-cut";

const polygons = new Map<number, string>();
const applied = new WeakMap<HTMLElement, number>();
let observer: ResizeObserver | null = null;

const fromStart = (k: number) => (k === 0 ? "0" : `calc(var(--s) * ${k})`);
const fromEnd = (k: number) =>
  k === 0 ? "100%" : `calc(100% - var(--s) * ${k})`;

/** A rectangle with `n` one-shadow-pixel stair steps cut from each corner, clockwise. */
function cutPolygon(n: number) {
  const cached = polygons.get(n);
  if (cached) return cached;
  const points = [`0 ${fromStart(n)}`];
  for (let j = 1; j <= n; j++)
    points.push(
      `${fromStart(j)} ${fromStart(n - j + 1)}`,
      `${fromStart(j)} ${fromStart(n - j)}`,
    );
  for (let i = 0; i < n; i++)
    points.push(
      `${fromEnd(n - i)} ${fromStart(i)}`,
      `${fromEnd(n - i)} ${fromStart(i + 1)}`,
    );
  points.push(`100% ${fromStart(n)}`, `100% ${fromEnd(n)}`);
  for (let j = 1; j <= n; j++)
    points.push(
      `${fromEnd(j)} ${fromEnd(n - j + 1)}`,
      `${fromEnd(j)} ${fromEnd(n - j)}`,
    );
  for (let i = 0; i < n; i++)
    points.push(
      `${fromStart(n - i)} ${fromEnd(i)}`,
      `${fromStart(n - i)} ${fromEnd(i + 1)}`,
    );
  points.push(`0 ${fromEnd(n)}`);
  const polygon = `polygon(${points.join(",")})`;
  polygons.set(n, polygon);
  return polygon;
}

/** The shadow pixel is set once on :root, so one read covers every element. */
function shadowPixel() {
  const root = document.documentElement;
  return Number.parseFloat(getComputedStyle(root).getPropertyValue("--s"));
}

/** Reads every size first, then writes only what changed, so layout never thrashes. */
function update(elements: Iterable<HTMLElement>) {
  const step = shadowPixel() * STEP_SIDE;
  if (!(step > 0)) return;
  const changes: [HTMLElement, number][] = [];
  for (const el of elements) {
    const side = Math.min(el.offsetWidth, el.offsetHeight);
    const max = "cutFree" in el.dataset ? Infinity : MAX_STEPS;
    const steps = Math.min(max, Math.max(1, Math.floor(side / step)));
    if (applied.get(el) !== steps) changes.push([el, steps]);
  }
  for (const [el, steps] of changes) {
    applied.set(el, steps);
    el.style.setProperty("--cut", cutPolygon(steps));
  }
}

function resizeObserver() {
  observer ??= new ResizeObserver((entries) =>
    update(entries.map((entry) => entry.target as HTMLElement)),
  );
  return observer;
}

/** Ref for `.pixel-cut` elements that mount later, like menu panels. */
export function pixelCutRef(el: HTMLElement | null) {
  if (!el) return;
  const cuts = resizeObserver();
  cuts.observe(el);
  return () => cuts.unobserve(el);
}

/** Sizes the stair-stepped corners of every `.pixel-cut` on the page. */
export function PixelCorners() {
  useEffect(() => {
    const cuts = resizeObserver();
    const elements = [...document.querySelectorAll<HTMLElement>(SELECTOR)];
    for (const el of elements) cuts.observe(el);
    // The shadow pixel follows the viewport, so a resize can change steps without a size change.
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        update(document.querySelectorAll<HTMLElement>(SELECTOR)),
      );
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      for (const el of elements) cuts.unobserve(el);
    };
  }, []);
  return null;
}
