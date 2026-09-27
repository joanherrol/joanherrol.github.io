---
title: Characters and Bullets Use Only Top-Down Ground Shadows
impact: HIGH
impactDescription: keeps game objects in the game's perspective, not the UI's
tags: shadow, sprite, bullets, characters
---

## Characters and Bullets Use Only Top-Down Ground Shadows

UI shadows fall down and right. Characters and bullets live in a top-down game view, so they cast only the ground shadow drawn in their sprite art (a flat ellipse under the feet, one under the gun). Never give a sprite a UI drop shadow or outline. A character standing on something (a player on a letter of the hero name) has no shadow at all.

A bullet's shadow is a black copy on the floor, `floor` art rows below it: from the muzzle row down to the shadow row. With no ground shadow, the floor is the character's feet, one row lower.

**Incorrect:**

```tsx
<PixelSprite sheet={idle} style={{ filter: "drop-shadow(3px 3px 0 black)" }} />
```

**Correct:**

```css
.pixel-bullet {
  background: var(--color-white);
  box-shadow: 0 calc(var(--px) * var(--floor, 5)) var(--color-black);
}
```

```tsx
// Standing on something (no ground shadow), the floor is its feet.
<Bullets bullets={bullets} scale={scale} flipX={flipX} floor={shadow ? 5 : 6} />
```

In a free-flying game layer, render bullet shadows as separate elements in a lower fixed layer: `top: y + floor * scale`, with `floor = FLOOR_ROW - muzzleRow`.
