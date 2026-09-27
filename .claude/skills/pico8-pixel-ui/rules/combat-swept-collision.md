---
title: Sweep Each Bullet's Move Against Where Covers Were
impact: HIGH
impactDescription: no tunnelling through thin covers, and scrolling into a bullet still counts
tags: combat, collision, swept, obb, scroll
---

## Sweep Each Bullet's Move Against Where Covers Were

A fast bullet can jump past a thin cover between frames. Treat its move from last frame's box to this frame's box as a segment, and intersect it (slab method) with each cover grown by the bullet's half size, in the cover's local axes. Measure the start point against the cover's previous position, so a page scrolled into a bullet registers. The earliest hit (`t` from 0 to 1) wins, whether it's a cover or a character.

**Incorrect (overlap test at the current frame only):**

```ts
if (rectsOverlap(bullet.getBoundingClientRect(), cover)) hit();
```

**Correct:**

```ts
export function sweep(prev: Box, now: Box, cover: Cover, before: Cover | undefined, dir: number): Hit | null {
  const r = now.size / 2;
  const e = (now.size / 2) * (Math.abs(cover.cos) + Math.abs(cover.sin)); // bullet reach on tilted axes
  const a = toLocal(prev.x + r, prev.y + r, before ?? cover);
  const b = toLocal(now.x + r, now.y + r, cover);
  const half = [cover.hw + e, cover.hh + e];
  let enter = -Infinity, exit = Infinity, axis = -1, side = 0;
  for (const k of [0, 1]) {
    const ds = b[k] - a[k];
    if (Math.abs(ds) < 1e-6) { if (Math.abs(a[k]) >= half[k]) return null; continue; }
    const t0 = (-half[k] - a[k]) / ds, t1 = (half[k] - a[k]) / ds;
    if (Math.min(t0, t1) > enter) { enter = Math.min(t0, t1); axis = k; side = ds > 0 ? -1 : 1; }
    exit = Math.min(exit, Math.max(t0, t1));
  }
  if (enter >= exit || enter > 1 || exit <= 0) return null;
  // …already inside: struck the face it flew at; else normal = local axis rotated to world
}
```

```ts
const tick = () => {
  const covers = readCovers();
  for (const shot of live.values()) advance(shot, covers, last, before);
  before = new Map(covers.map((c) => [c.key, c]));
  raf = requestAnimationFrame(tick);
};
```

Read the bullet's real on-screen box (`getBoundingClientRect` of the CSS-animated element) rather than predicting it. The first frame's `prev` is the spawn point.
