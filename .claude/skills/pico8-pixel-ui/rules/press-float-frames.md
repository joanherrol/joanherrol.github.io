---
title: Image Frames Start Upright, Then Bob and Sway; Their Shadow Only Sways
impact: MEDIUM
impactDescription: lively frames whose shadow reads as the ground
tags: motion, float, tilt, frames
---

## Image Frames Bob and Tilt; Their Shadow Only Tilts

Image frames and their pictures float. Every frame starts upright, with no rotation at all, then bobs up to 2 of its pixels and sways ±1°. The sign of `tilt` picks which way it leans first. Give neighbours different positive delays so they drift out of phase; a positive delay keeps each frame upright until it starts, which a negative delay wouldn't. The shadow shares the tilt keyframes but not the bob. With reduced motion on, frames sit still and upright. The implementation is in `shadow-wrap-to-animate`.

**Incorrect (the whole figure bobs, shadow included, so it floats with no ground):**

```css
figure { animation: bob 2s infinite alternate; filter: drop-shadow(6px 6px 0 black); }
```

**Correct:**

```tsx
<WindowFrame title="Game" tilt={-1}>…</WindowFrame>
<ConsoleFrame title="P1" tilt={1} delay={1.5}>…</ConsoleFrame>
```

Collisions treat a tilted frame as an oriented box read from its computed `rotate` (see `combat-covers-not-shadows`).
