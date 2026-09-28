---
title: Shadows Are Solid Same-Shape Copies, Never Bands
impact: CRITICAL
impactDescription: prevents the background showing between an element and its shadow as it moves
tags: shadow, sibling, float, cards, corners
---

## Shadows Are Solid Same-Shape Copies, Never Bands

A shadow is a black copy of the element's whole shape behind it, offset down and right. It is never an L-shaped band or border along the edges: when the element lifts or tilts, a band leaves a gap where the background shows through.

- **Resting elements** (static cards that neither float nor respond to the pointer): like titles, a same-size copy extended 1 `--s` right and down, so one shadow pixel runs the whole right and bottom edge, corner to corner.
- **Floating elements** (menus, panels, image frames): a copy grown 1 `--s` right and down and resting 1 `--s` right and down, so 2 shadow pixels show and the right and bottom edges are covered all the way along.
- **Titles**: 1 `--s` (see `shadow-title-drop-copy`).
- **Pressables**: an exact-size copy, 1 `--s` down (see `press-float-raise`).

**Incorrect (a band: lift the card and the background appears in the corner):**

```css
.card { border-right: 6px solid black; border-bottom: 6px solid black; }
.card { box-shadow: 6px 6px 0 black; } /* moves with the card; can't stay on the ground */
```

**Correct (a sibling element, so the face's corner clip never clips it):**

```css
.pixel-shadow {
  position: absolute;
  z-index: -1;
  background-color: var(--color-black);
  clip-path: var(--cut); /* the same stair-stepped shape, see surface-cut-corners */
  pointer-events: none;
}
.pixel-float > .pixel-shadow {
  inset: var(--s) calc(var(--s) * -2) calc(var(--s) * -2) var(--s);
}
.pixel-flat > .pixel-shadow {
  inset: 0 calc(var(--s) * -1) calc(var(--s) * -1) 0;
}
```

```tsx
<div className="pixel-flat pixel-cut">
  <PixelShadow />
  <div className="pixel-face card-cream p-4">…</div>
</div>
```

The shadow never moves: pressables and floating frames move only their face (see `press-float-raise`, `shadow-wrap-to-animate`).
