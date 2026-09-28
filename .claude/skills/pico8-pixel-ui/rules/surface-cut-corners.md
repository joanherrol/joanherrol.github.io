---
title: Surfaces Have Stair-Stepped Corners
impact: MEDIUM-HIGH
impactDescription: pixel-art corners on every button, card, chip, frame and menu, with shadows that match
tags: surface, corners, clip-path, buttons, cards, menus
---

## Surfaces Have Stair-Stepped Corners

Buttons, cards, chips, image frames and menu panels lose a stair of `--s` squares from each corner, like a pixel-art rounded rectangle. They get one step per 12 `--s` of their shorter side, with a minimum of 1, so small controls get one notch and big windows get several. Never use `border-radius`: it anti-aliases, and it can't be drawn in whole pixels.

- Cut with `clip-path: var(--cut)`. `--cut` is a polygon in `var(--s)` and `%` terms, so it follows the element's size and stays on the pixel grid.
- `clip-path` also clips the element's own pseudo-elements, so a shadowed surface splits in two:
  - the **host** (`.pixel-cut` plus `.pixel-float`, `.pixel-flat` or `.pixel-button`) carries position, sizing and the pointer;
  - it holds a **sibling shadow** (`.pixel-shadow`, see `shadow-solid-copy`) and a **face** (`.pixel-face`, clipped) that carries fill, padding and text.
- Unshadowed surfaces (chips, badges) put `pixel-cut pixel-face` on one element.
- The shadow uses the same `--cut`: its `%` terms resolve against its own box, so the stairs line up with the face.
- `PixelCorners` (mounted once in the root layout) sets `--cut` on every `.pixel-cut` from its size with a shared `ResizeObserver`. It reads every size first, then writes only the changed values, so it never forces a layout. Elements that mount later, like menu panels, take `ref={pixelCutRef}`. The CSS default is one step, which shows until hydration.

**Incorrect (border-radius blurs the corner; clipping the host also clips its `::before` shadow):**

```css
.card { border-radius: 8px; }
.card { clip-path: var(--cut); } /* the shadow pseudo disappears with the corner */
```

**Correct:**

```css
.pixel-cut {
  --cut: polygon(0 var(--s), var(--s) var(--s), var(--s) 0, /* … one step, clockwise … */);
}
.pixel-face {
  position: relative;
  clip-path: var(--cut);
}
```

```tsx
<div className="pixel-flat pixel-cut">
  <PixelShadow />
  <div className="pixel-face card-cream p-4">…</div>
</div>
<li className="pixel-cut pixel-face card-accent px-3 py-2">React</li>
```

Class names that other code looks up (the collision covers `.card-cream`, `.card-accent`, `.float-body`) belong on the face, the part you can see.
