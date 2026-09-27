---
title: Simple Swept Hitboxes; the Bullet Disappears on the First Hit
impact: HIGH
impactDescription: reliable, cheap collisions with no bullets passing through or lingering
tags: combat, collision, hitbox, aabb, sparks
---

## Simple Swept Hitboxes; the Bullet Disappears on the First Hit

Bullets fly horizontally, so a hit test only needs rectangles. Sweep from last frame's box to this frame's box along x, so a fast bullet can't jump over a thin cover. The nearest box along the flight direction wins, whether it's a cover or the target character. On a hit, hide every copy of the bullet at once, drop it from the live set, and spark at the face. Keep it simple: per-pixel masks, tilted boxes and resting bullets against faces cost more than they add, and they made bullets linger.

**Incorrect (overlap at the current frame only; tunnels through thin covers, and the bullet stays visible):**

```ts
if (overlaps(bullet.getBoundingClientRect(), cover)) spark();
```

**Correct:**

```ts
export function firstHit(prev: Rect, now: Rect, rects: Rect[], dir: number) {
  const left = Math.min(prev.left, now.left);
  const right = Math.max(prev.right, now.right);
  let best: { x: number } | null = null;
  for (const r of rects) {
    if (r.right <= left || r.left >= right) continue;
    if (r.bottom <= now.top || r.top >= now.bottom) continue;
    const x = dir > 0 ? Math.max(r.left, prev.left) : Math.min(r.right, prev.right);
    if (!best || (dir > 0 ? x < best.x : x > best.x)) best = { x };
  }
  return best;
}

const struck = firstHit(prev, now, spriteRects(target), dir);
const cover = firstHit(prev, now, covers, dir);
if (struck && (!cover || (dir > 0 ? struck.x <= cover.x : struck.x >= cover.x)) && damage(shot.id)) {
  hide(shot.id); // visibility: hidden on every [data-shot] copy
  removeShot(shot.id);
} else if (cover) {
  hide(shot.id);
  removeShot(shot.id);
  addSpark(cover.x + ((-dir - 1) * scale) / 2, now.top + now.height / 2 - scale / 2, sparkPieces(color, [-dir, 0]));
}
```

```ts
function sparkPieces(color: string, [nx, ny]: [number, number]) {
  return Array.from({ length: 6 }, (_, i) => {
    const along = 2 + Math.random() * 4;
    const across = (Math.random() - 0.5) * 8;
    return { x: 0, y: 0, color: i % 3 ? color : "#fff1e8", dx: Math.round(nx * along - ny * across), dy: Math.round(ny * along + nx * across) };
  });
}
```

A target that can't be hurt right now (dead, respawning, off screen) doesn't stop the bullet. The first frame's `prev` is the spawn point. Scrolling a cover into a fixed bullet counts too, because the current-frame overlap is part of the sweep.
