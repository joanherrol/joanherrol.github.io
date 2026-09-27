---
title: Keep Shadows on a Ground Layer With No Stacking Contexts Above
impact: CRITICAL
impactDescription: prevents shadows jumping above bullets or painting over their own element
tags: shadow, z-index, stacking-context, layers
---

## Keep Shadows on a Ground Layer With No Stacking Contexts Above

Shadows are `z-index: -1` pseudo-elements. For them to land below projectiles and above the section background, the section paints its background on its own `::before` at `-1`, and neither the shadowed element nor any ancestor may form a stacking context. `transform`, `opacity < 1`, `filter`, `position: sticky`, `container-type`, `will-change`, `isolation` or `z-index` on a positioned element all trap the shadow inside.

Layers, bottom to top:

1. Section backgrounds.
2. Ground: shadows, bullet shadows, bullets (z −1, painted in DOM order).
3. Content: cards, text, frames.
4. Side-lane characters, sparks, muzzle flashes (z 40).
5. Fixed menus.

**Incorrect (the reveal keeps a transform, so every shadow inside paints over the card):**

```css
[data-reveal] { animation: reveal 600ms ease-out forwards; } /* forwards keeps transform */
.sidebar { position: sticky; top: 1rem; } /* sticky + shadowed = black block */
```

**Correct:**

```css
.section-paper { background-color: transparent; }
.section-paper::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: var(--paper);
  pointer-events: none;
}
/* Filling backwards only drops the effect once in, so no stacking context remains. */
[data-reveal] {
  animation: reveal ease-out backwards;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

```tsx
{/* Sticky goes on a wrapper, never on the shadowed card. */}
<div className="sticky top-4 self-start"><aside className="card-cream pixel-float">…</aside></div>
```

Big black blocks over content, or a shadow drawn on top of its own element, always mean a stacking context in the wrong place. Walk the ancestors with `getComputedStyle` and look for `transform`, `opacity`, `position`, `zIndex`, `containerType` or `filter`.
