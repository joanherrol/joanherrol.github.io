---
title: Compose Characters From Layered Sprites
impact: HIGH
impactDescription: correct depth order, facing and hit masks for multi-part characters
tags: sprite, layers, weapon, flip, collision
---

## Compose Characters From Layered Sprites

Stack each part as its own absolutely positioned canvas, bottom to top: gun shadow, body shadow, body, gun. Offsets are in art pixels times `scale`, with separate left and right values per facing. Flip with the canvas transform (`flipX`), not CSS `scaleX(-1)`, so the bitmap and its box stay in step. Only the body is the character: mark it `sprite-solid` (its hitbox) and tint only it. The gun is not hit, and only its hand pixels flash (`tintOnly`); the shadows do neither.

**Correct:**

```ts
const GUN = { left: -5, right: 7, top: 2 };
const GUN_SHADOW = { left: -6, right: 5, top: 9 };
// On the gun tip in its recoil frame, so the first moving frame looks flush.
export const MUZZLE = { left: -3, right: 10, top: 4 };
```

```tsx
const side = flipX ? "right" : "left";
<div className="relative" style={{ width: 8 * scale, height: (shadow ? 11 : 10) * scale, "--px": `${scale}px` }}>
  {shadow && weapon && (
    <PixelSprite sheet={shooting ? GUN_SHADOW_SHOOT : GUN_SHADOW_IDLE} loop={false} scale={scale} flipX={flipX}
      className="absolute" style={{ left: GUN_SHADOW[side] * scale, top: GUN_SHADOW.top * scale }} />
  )}
  {shadow && <PixelSprite sheet={SHADOW} scale={scale} className="absolute left-0" style={{ top: 9 * scale }} />}
  <PixelSprite sheet={BODY[animation]} scale={scale} flipX={flipX} tint={tint}
    className="sprite-solid absolute left-0 top-0" />
  {weapon && (
    <PixelSprite sheet={shooting ? GUN_SHOOT : GUN_IDLE} loop={false} scale={scale} flipX={flipX}
      tint={tint} tintOnly="#ffccaa" className="absolute" style={{ left: GUN[side] * scale, top: GUN.top * scale }} />
  )}
</div>
```

The gun shot animation and its shadow play once (`loop={false}`), in step with a 250ms recoil window. An enemy centres its shadow under the body (`left: (width - shadowWidth) / 2 * scale`, `bottom: 0`) and shifts the body by `sink` rows.
