---
title: Horizontal Strip Sheets With Typed Metadata
impact: HIGH
impactDescription: one renderer for every character; per-kind quirks live in data
tags: sprite, sheets, metadata, animation
---

## Horizontal Strip Sheets With Typed Metadata

Each animation is a PNG with frames laid out left to right: `src`, `frameWidth`, `frameHeight`, `frames`, `fps` (12 by default, like the source game). Keep a separate 1-frame sheet for each ground shadow. Put per-character facts in data (size, shadow size and first visible shadow row, muzzle row, fire frames, sink, transition frames), not in components.

**Incorrect (magic numbers inside components):**

```tsx
{kind === 3 && <div style={{ top: 4 }} />}
```

**Correct:**

```ts
export type SpriteSheet = { src: string; frameWidth: number; frameHeight: number; frames: number; fps?: number };

export type EnemyKind = {
  id: number;
  width: number; height: number;
  shadowWidth: number; shadowHeight: number;
  /** First visible row of the shadow art. */
  shadowTop: number;
  attackFrames: number;
  fireFrames: number[];      // attack frames that fire a bullet
  muzzleTop: number;         // art row the bullet leaves from
  sink?: number;             // rows the body sits lower (+) or higher (−) than its box
  flipX?: boolean;           // art drawn facing the wrong way
  attackFromIdle?: number;   // idle frame that best leads into attack frame 0
  idleAfterAttack?: number;  // idle frame that best follows the last attack frame
  attackStart?: number;      // leading attack frames skipped because they fight the idle motion
};

function sheet(kind: EnemyKind, animation: "idle" | "walk" | "hit" | "attack"): SpriteSheet {
  const base = `/imgs/Enemies/Enemy${kind.id}/Enemy${kind.id}`;
  const frame = { frameWidth: kind.width, frameHeight: kind.height };
  if (animation === "attack") return { src: `${base}-Attack.png`, ...frame, frames: kind.attackFrames, fps: 12 };
  if (animation === "hit") return { src: `${base}-Hit.png`, ...frame, frames: 2, fps: 12 };
  return { src: `${base}-${animation === "walk" ? "Walk" : "Idle"}.png`, ...frame, frames: 6, fps: 12 };
}
```

Export PNGs at 1× art size and let the renderer scale. Ship pixel art as lossless WebP or PNG, never lossy.
