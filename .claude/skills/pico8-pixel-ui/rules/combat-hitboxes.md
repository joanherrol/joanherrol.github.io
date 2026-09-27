---
title: Simple Swept Hitboxes; the Bullet Disappears on the First Hit
impact: HIGH
impactDescription: reliable, cheap collisions with no bullets passing through or lingering
tags: combat, collision, hitbox, aabb, sparks
---

## Simple Swept Hitboxes; the Bullet Disappears on the First Hit

Bullets move horizontally and covers move vertically as the page scrolls, so rectangles are enough. Each frame, sweep the bullet from its last x to its new x, and sweep each cover over the scroll distance `dy` since the last frame. Nothing then tunnels, whether it flew or scrolled past. The nearest box along the flight direction wins, cover or character. On a hit, draw the bullet flush at the contact point for that one frame, stop checking it, remove it on the next frame, and spark off cover.

**Incorrect (overlap at the current frame only; tunnels on fast shots or fast scrolls, and draws the bullet past the face):**

```ts
if (overlaps(bullet.getBoundingClientRect(), cover)) spark();
```

**Correct:**

```ts
export function firstHit(from: number, to: number, size: number, top: number, rects: Rect[], dy: number) {
  const dir = Math.sign(to - from) || 1;
  const left = Math.min(from, to);
  const right = Math.max(from, to) + size;
  let best: { x: number; vertical: boolean } | null = null;
  for (const r of rects) {
    if (r.right <= left || r.left >= right) continue;
    if (Math.max(r.bottom, r.bottom + dy) <= top) continue;
    if (Math.min(r.top, r.top + dy) >= top + size) continue;
    const inside = r.left < from + size && r.right > from;
    const x = inside ? from : dir > 0 ? r.left - size : r.right;
    if (!best || (x - best.x) * dir < 0) best = { x, vertical: inside };
  }
  return best;
}
```

```ts
const dy = window.scrollY - lastScrollY;
const struck = firstHit(from, to, size, shot.y, spriteRects(target), 0);
const cover = firstHit(from, to, size, shot.y, covers, dy);
if (struck && (!cover || (struck.x - cover.x) * dir <= 0) && damage(shot.id)) {
  place(shot, struck.x);
  land(shot.id); // live.delete(id); requestAnimationFrame(() => removeShot(id))
} else if (cover) {
  place(shot, cover.x);
  land(shot.id);
  addSpark(/* at the face */, sparkPieces(color, cover.vertical ? [0, dy > 0 ? -1 : 1] : [-dir, 0]));
} else {
  place(shot, to);
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

A target that can't be hurt right now (dead, respawning, off screen) doesn't stop the bullet. Removing the element in the same frame as the hit would make React drop it before the flush frame paints, which is why removal waits one frame.
