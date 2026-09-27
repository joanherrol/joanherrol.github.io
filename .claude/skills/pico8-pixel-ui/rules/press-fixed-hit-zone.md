---
title: The Hit Zone Never Moves
impact: HIGH
impactDescription: stops hover flicker when the cursor sits on a moving button's edge
tags: press, pointer-events, hover, hit-testing
---

## The Hit Zone Never Moves

When a face lifts on hover, a cursor on its bottom or right edge ends up outside it, so it drops, re-enters, lifts again, and flickers. Make the element ignore the pointer and give a transparent `::after`, pinned to the resting position, the pointer instead. `:hover` and `:active` still match, because the pseudo belongs to the element.

**Incorrect:**

```css
.pixel-button:hover { --raise: var(--px); } /* the element's own box moves out from under the cursor */
```

**Correct:**

```css
@layer components {
  .pixel-button::after {
    content: "";
    position: absolute;
    inset: var(--raise) calc(var(--raise) * -1) calc(var(--raise) * -1) var(--raise);
    pointer-events: auto;
  }
}
/* Unlayered so it beats pointer-events utilities: only the resting hit zone takes the pointer. */
.pixel-button { pointer-events: none; }
```

Keep the `none` rule unlayered. Inside `@layer components`, a utility such as `pointer-events-auto` on a parent menu would override it.
