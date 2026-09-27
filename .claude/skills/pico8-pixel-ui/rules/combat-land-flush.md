---
title: Stop Bullets Flush on the Face, Then Spark Perpendicular
impact: MEDIUM
impactDescription: impacts look solid instead of overshooting or stopping short
tags: combat, bullets, sparks, impact
---

## Stop Bullets Flush on the Face, Then Spark Perpendicular

On the frame of impact, freeze every copy of the bullet (it may exist in several layers) at the x where it touches the face: stop its CSS animation and set its transform to the resting offset. If it hit a top or bottom face, hide it. Then emit sparks from the face along its normal, with random spread across it.

**Correct:**

```ts
// Rests every copy of a bullet against what it struck, or hides it.
function land(id: number, x: number | null) {
  for (const el of document.querySelectorAll<HTMLElement>(`[data-shot="${id}"]`)) {
    if (x === null) { el.style.visibility = "hidden"; continue; }
    el.style.animation = "none";
    el.style.transform = `translateX(${x - Number.parseFloat(el.style.left)}px)`;
  }
}

function sparkPieces(color: string, [nx, ny]: [number, number]) {
  return Array.from({ length: 6 }, (_, i) => {
    const along = 2 + Math.random() * 4;
    const across = (Math.random() - 0.5) * 8;
    return {
      x: 0, y: 0, color: i % 3 ? color : "#fff1e8",
      dx: Math.round(nx * along - ny * across),
      dy: Math.round(ny * along + nx * across),
    };
  });
}
```

`restAgainst(box, cover, dir)` solves the bullet's row against the (possibly tilted) cover to get the exact resting left edge. Sparks are the bullet's colour mixed with white, last 250ms, and play a short high-pitched tick.
