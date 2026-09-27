---
title: Hit Characters at Their First Coloured Pixel
impact: MEDIUM-HIGH
impactDescription: bullets pass through gaps between limbs and stop on the visible pixel
tags: combat, collision, sprite, alpha, mask
---

## Hit Characters at Their First Coloured Pixel

Keep a registry of what each sprite canvas shows (image, frame, size, flip). For the rows a bullet crosses, find the leftmost and rightmost coloured column of that frame (alpha ≥ 128), converted to screen pixels. Cache the spans per image and frame key.

**Incorrect (bounding box of the canvas):**

```ts
if (bullet.right >= canvas.getBoundingClientRect().left) hurt();
```

**Correct:**

```ts
const shown = new WeakMap<HTMLCanvasElement, { img: HTMLImageElement; frame: number; w: number; h: number; flip: boolean }>();
// set in draw(): shown.set(canvas, { img, frame, w, h, flip });

export function solidRows(canvas: HTMLCanvasElement) {
  const s = shown.get(canvas);
  if (!s) return null;
  const key = `${s.frame} ${s.w} ${s.h} ${s.flip}`;
  // cached per image: spans[y] = [firstX, lastX] | null, mirrored when flipped
}

export function strike(prev: Box, now: Box, dir: number, canvases: Iterable<HTMLCanvasElement>) {
  const span = solidSpan(canvases, now.y, now.y + now.size); // across body + gun canvases
  if (!span) return null;
  const [left, right] = span;
  const from = Math.min(prev.x, now.x), to = Math.max(prev.x, now.x) + now.size;
  if (to <= left || from >= right) return null;
  const x = dir > 0 ? left - now.size : right;
  const move = now.x - prev.x;
  return { t: move ? Math.min(1, Math.max(0, (x - prev.x) / move)) : 0, x };
}
```

Only canvases marked `.sprite-solid` (body and gun) count; shadow canvases never do. Read the alpha once per image with `getContext("2d", { willReadFrequently: true })`.
