---
title: Spawn Shots Flush With the Muzzle on the Recoil Frame
impact: MEDIUM
impactDescription: flash and bullet read as leaving the gun, not floating beside it
tags: sprite, bullets, muzzle, flash, offsets
---

## Spawn Shots Flush With the Muzzle on the Recoil Frame

Measure the muzzle on the gun's recoil frame (the frame shown when the bullet appears), in art pixels per facing. Place the bullet and a cone-shaped flash there. Enemy shots leave from the horizontal centre of the sprite at `muzzleTop`, snapped to whole pixels. Check the gap at phone scale too: one art pixel of gap at scale 4 is very visible.

**Incorrect (from the idle gun tip; a pixel gap shows once recoil pulls the gun back):**

```ts
const x = left + 11 * scale;
```

**Correct:**

```ts
export const MUZZLE = { left: -3, right: 10, top: 4 };
const x = playerLeft + MUZZLE.right * scale;
const y = trackY() + MUZZLE.top * scale;
addShot({ from: "player", x, y, floor: FLOOR_ROW - MUZZLE.top });
addSpark(x, y, flashPieces(1, FLASH_COLORS.player, id), "is-flash");

// Enemy
const x = Math.round(sprite.left + sprite.width / 2);
const y = Math.round(sprite.top + kind.muzzleTop * scale);
addSpark(x, y + scale / 2, flashPieces(-1, FLASH_COLORS.enemy, id), "is-flash");
```

```ts
export const FLASH_COLORS = {
  player: ["#fff1e8", "#ffec27", "#ffa300"],
  enemy: ["#ff004d", "#ffa300", "#fff1e8"],
} as const;
// Deterministic noise, so a flash looks the same on every render.
function noise(seed: number) { const x = Math.sin(seed * 12.9898) * 43758.5453; return x - Math.floor(x); }
export function flashPieces(dir: number, colors: readonly string[], seed: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const spread = i / 5 - 0.5 + (noise(seed + i) - 0.5) * 0.2;
    const angle = spread * (100 * Math.PI) / 180;
    const distance = 3 + noise(seed + i + 0.5) * 4;
    return { x: 0, y: 0, color: colors[i % colors.length], dx: dir * Math.cos(angle) * distance, dy: Math.sin(angle) * distance };
  });
}
```

Player bullets are 1 art pixel, white. Enemy bullets are 2 art pixels, red. The player's recoil (`useOneShot(250)`) blocks re-firing until it ends.
