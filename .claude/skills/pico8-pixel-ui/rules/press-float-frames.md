---
title: Image Frames Bob and Tilt; Their Shadow Only Tilts
impact: MEDIUM
impactDescription: lively frames whose shadow reads as the ground
tags: motion, float, tilt, frames
---

## Image Frames Bob and Tilt; Their Shadow Only Tilts

Image frames float. They bob up to 2 of their pixels and tilt ±1° around a resting tilt. Give each frame a negative animation delay so neighbours drift out of phase. The shadow shares the tilt keyframes but not the bob. With reduced motion on, frames sit still at their resting tilt. The implementation is in `shadow-wrap-to-animate`.

**Incorrect (the whole figure bobs, shadow included, so it floats with no ground):**

```css
figure { animation: bob 2s infinite alternate; filter: drop-shadow(6px 6px 0 black); }
```

**Correct:**

```tsx
<WindowFrame title="Game" tilt={-1}>…</WindowFrame>
<ConsoleFrame title="P1" tilt={2} delay={1.5}>…</ConsoleFrame>
```

Collisions treat a tilted frame as an oriented box read from its computed `rotate` (see `combat-covers-not-shadows`).
