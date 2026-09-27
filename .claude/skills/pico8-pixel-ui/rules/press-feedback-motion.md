---
title: Reveals, Hurt Flashes and Reduced Motion
impact: MEDIUM
impactDescription: smooth motion that stays pure palette and respects user settings
tags: motion, reveal, scroll-timeline, hurt, reduced-motion
---

## Reveals, Hurt Flashes and Reduced Motion

- **Scroll reveals** are CSS view timelines, which run on the compositor and stay smooth on iOS. Fill `backwards` only (see `shadow-ground-layer`).
- **Hurt feedback** is a solid palette flash, the way PICO-8 swaps palettes: the whole sprite goes solid red twice, 70ms on and 70ms off, starting at 0 and 140ms. No transparency.
- **Blinking prompts** use `steps(1)`, so they switch on and off with no fade.
- **Reduced motion** turns off bobbing, particles, bullets and slide-ins.

**Incorrect:**

```tsx
<div style={{ opacity: hurt ? 0.5 : 1, filter: hurt ? "sepia(1) hue-rotate(-50deg)" : "none" }}>
```

**Correct:**

```ts
// Inside the sprite draw: a solid palette colour over the drawn pixels only.
if (tint) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = tint; // "#ff004d"
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
}

const flashHurt = (flashes: number[]) => {
  timers.forEach(clearTimeout);
  setHurt(false);
  timers = flashes.flatMap((at) => [
    setTimeout(() => setHurt(true), at),
    setTimeout(() => setHurt(false), at + 70),
  ]);
};
flashHurt([0, 140]);
```

```css
@keyframes reveal {
  from { opacity: 0; transform: translate3d(0, calc(var(--p) * 8), 0); }
}
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-reveal] {
      animation: reveal ease-out backwards;
      animation-timeline: view();
      animation-range: entry 0% entry 100%;
    }
  }
}
.blink { animation: blink 1.1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
```

Tint the body and gun, never the ground shadows. A redraw on tint change must not restart the frame clock: keep tint in a ref and call a stored `redraw()`.
