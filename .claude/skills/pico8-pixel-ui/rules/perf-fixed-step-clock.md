---
title: Fixed-Step Sprite Clock That Sleeps Between Frames
impact: MEDIUM-HIGH
impactDescription: 12fps sprites wake 12 times a second instead of 60 to 120, and stay in sync with timers
tags: perf, sprite, raf, timers, intersection-observer
---

## Fixed-Step Sprite Clock That Sleeps Between Frames

Don't run a `requestAnimationFrame` loop per sprite that checks elapsed time every refresh. Advance frames on a fixed step (`last += step`), allow drawing up to 8ms early so the nearest refresh takes the frame, then sleep with `setTimeout` until just before the next step. Reset the clock after long pauses instead of fast-forwarding. Stop off screen with an `IntersectionObserver`, and don't animate at all with reduced motion.

**Incorrect:**

```ts
const loop = (t: number) => {
  frame = Math.floor(t / (1000 / fps)) % frames; // drifts vs setTimeout-scheduled attacks
  draw();
  requestAnimationFrame(loop);                     // wakes every refresh, forever, even off screen
};
```

**Correct:**

```ts
const EARLY_MS = 8;
const step = 1000 / rate;
const tick = (t: number) => {
  raf = 0;
  if (last === 0 || t - last > step * frames) last = t;
  if (t - last >= step - EARLY_MS) {
    if (!loop && frame === frames - 1) return;
    frame = (frame + 1) % frames;
    last += step;
    draw();
  }
  wake = window.setTimeout(() => {
    wake = 0;
    raf = requestAnimationFrame(tick);
  }, Math.max(0, last + step - EARLY_MS - performance.now()));
};

const observer = new IntersectionObserver(([entry]) => {
  onScreen = entry.isIntersecting;
  if (onScreen) start(); else stop();
});
```

Keep `flipX` and `tint` in refs and redraw on change, so they never restart the clock or the effect.
