---
title: Pressables Float, Lift One Own Pixel, Press Flush
impact: HIGH
impactDescription: tactile buttons whose shadow never moves or shows the background
tags: press, buttons, hover, active, property, transition
---

## Pressables Float, Lift One Own Pixel, Press Flush

Buttons, header buttons and link cards float 1 `--s` above a black copy of exactly their shape.

- **At rest,** 1 shadow pixel shows.
- **On hover,** the face rises 1 of its own text pixels (`--px: 0.125em`), so small controls don't jump.
- **When pressed,** it sinks flush onto the floor, covering the shadow completely.

Drive all three from one registered `<length>` (`--raise`) so it can transition. Move the face with `top`/`left` offsets; a transform would carry the shadow along. The shadow pseudo counter-offsets by `--raise`, so it stays still on the ground.

**Incorrect (translate moves the ::before shadow too; scale leaves half pixels):**

```css
.btn:hover  { transform: translate(-2px, -2px); box-shadow: 4px 4px 0 black; }
.btn:active { transform: scale(0.97); }
```

**Correct:**

```css
@property --raise {
  syntax: "<length>";
  inherits: true;
  initial-value: 0px;
}
.pixel-button {
  --px: 0.125em;
  position: relative;
  top: calc(var(--raise) * -1);
  left: calc(var(--raise) * -1);
  transition: --raise 100ms var(--ease-out);
}
.pixel-button::before { /* combined with .pixel-float::before: exact size, 1 --s down */
  inset: calc(var(--s) + var(--raise)) calc(var(--s) * -1 - var(--raise))
    calc(var(--s) * -1 - var(--raise)) calc(var(--s) + var(--raise));
}
@media (hover: hover) {
  .pixel-button:hover { --raise: var(--px); }
}
.pixel-button:active { --raise: calc(var(--s) * -1); }
```

```tsx
const buttonClasses =
  "card-accent pixel-float pixel-button inline-flex items-center justify-center gap-3 px-6 py-4 " +
  "text-body uppercase leading-none tracking-[0.125em] sm:gap-5 sm:px-11 sm:py-8 sm:text-body-lg";
```

Gate hover behind `(hover: hover)` so a tap on a phone doesn't leave the button stuck in its lifted state.
