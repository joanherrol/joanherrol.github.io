---
title: Drive Scroll-Linked Motion on the Compositor, in Whole-Pixel Steps
impact: MEDIUM
impactDescription: smooth scrolling on iOS; characters move in art-pixel steps like a game
tags: perf, scroll-timeline, steps, mobile, reveal
---

## Drive Scroll-Linked Motion on the Compositor, in Whole-Pixel Steps

Use scroll-driven CSS animations for reveals and for anything that tracks scroll (side characters moving down the page). Quantise with `steps(n, jump-none)`, where `n - 1` is the travel in art pixels, so the motion lands on whole pixels. Fall back to a snapped JS transform where `animation-timeline` is unsupported. Use `svh`/`lvh` probes rather than `innerHeight`, which jumps as mobile toolbars slide.

**Correct:**

```css
@keyframes companion-track {
  from { transform: translateY(var(--track-from)); }
  to   { transform: translateY(var(--track-to)); }
}
.companion-track.is-scroll-driven {
  animation: companion-track auto steps(var(--track-steps), jump-none) both;
  animation-timeline: scroll(root);
  animation-range: var(--range-start) var(--range-end);
}
```

```ts
const step = artPx();
t.style.setProperty("--track-steps", `${Math.max(2, Math.round((bottom - top) / step) + 1)}`);

// Unlike innerHeight, these ignore mobile toolbars sliding in and out.
function viewportHeights(probe: HTMLElement) {
  probe.style.height = "100svh"; const small = probe.offsetHeight;
  probe.style.height = "100lvh"; return { small, large: probe.offsetHeight };
}
```

Re-measure only when the key (width, small and large heights, scroll height) changes. Switch walk and idle animations from scroll activity: walk on scroll, back to idle 180ms after the last scroll event.
