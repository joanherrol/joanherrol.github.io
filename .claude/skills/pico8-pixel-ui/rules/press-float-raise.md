---
title: Pressables Float, Lift One Own Pixel, Press Flush
impact: HIGH
impactDescription: tactile buttons whose shadow never moves or shows the background
tags: press, buttons, hover, active, translate, transition
---

## Pressables Float, Lift One Own Pixel, Press Flush

Buttons, header buttons and link cards float 1 `--s` above a black copy of exactly their shape.

- **At rest,** 1 shadow pixel shows.
- **On hover,** the face rises 1 of its own text pixels (`0.125em`), so small controls don't jump.
- **When pressed,** it sinks flush onto the floor, covering the shadow completely.

Only the face moves. The host holds a sibling shadow and the face (see `surface-cut-corners`), so moving the face with `translate` leaves the shadow on the ground, and the compositor animates it without layout or paint. Never animate offsets (`top`/`left`) or a registered custom property: both relayout or repaint every frame.

**Incorrect (moves the whole element, shadow included; offsets relayout every frame; scale leaves half pixels):**

```css
.btn:hover  { transform: translate(-2px, -2px); box-shadow: 4px 4px 0 black; }
.btn:hover  { top: -2px; left: -2px; }
.btn:active { transform: scale(0.97); }
```

**Correct:**

```css
.pixel-button { position: relative; pointer-events: auto; }
.pixel-button > .pixel-shadow {
  inset: var(--s) calc(var(--s) * -1) calc(var(--s) * -1) var(--s); /* exact size, 1 --s down */
}
.pixel-button > .pixel-face {
  transition: translate 100ms var(--ease-out);
  pointer-events: none;
}
@media (hover: hover) {
  .pixel-button:hover > .pixel-face { translate: -0.125em -0.125em; }
}
.pixel-button:active > .pixel-face { translate: var(--s) var(--s); }
```

```tsx
<a href={href} className="pixel-button pixel-cut inline-flex">
  <PixelShadow />
  <span className="pixel-face card-accent inline-flex items-center gap-3 px-6 py-4 uppercase">
    {children}
  </span>
</a>
```

Gate hover behind `(hover: hover)` so a tap on a phone doesn't leave the button stuck in its lifted state. Hover colours on the face use `group-hover:` from the host.
