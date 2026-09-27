---
title: Title Shadows Are a Black Text Copy on the Ground
impact: HIGH
impactDescription: solid glyph shadows that bullets fly between, including accent rings
tags: shadow, text, titles, accessibility
---

## Title Shadows Are a Black Text Copy on the Ground

Don't use `text-shadow` on the visible text: it paints above the ground layer, so bullets would pass under it. Render an `aria-hidden` black copy of the text, absolutely positioned at `z-index: -1`, with three `text-shadow`s (right, down, diagonal) of 1 `--s`. That makes a solid shadow along the whole right and bottom edge of each glyph.

**Incorrect:**

```css
h2 { text-shadow: 3px 3px 0 black; }
```

**Correct:**

```tsx
export function DropText({ children }: { children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="drop-copy">{children}</span>
      {children}
    </>
  );
}
<h2 className="relative type-headline-md"><DropText>Level <Mark>clear</Mark></DropText></h2>
```

```css
.drop-copy {
  position: absolute;
  inset: 0;
  z-index: -1;
  color: var(--color-black);
  text-shadow:
    var(--s) 0 var(--color-black),
    0 var(--s) var(--color-black),
    var(--s) var(--s) var(--color-black);
  pointer-events: none;
  user-select: none;
}
```

A marked key word (`.text-mark`) gets a 1-glyph-pixel accent ring from 8 `text-shadow`s at ±`0.125em`. Its copy inside `.drop-copy` redraws the ring's 9 positions in black, plus the same 9 shifted by `--s` right, down and diagonally, so the ring is shadowed too. The full list is in `templates/globals.css`. Collisions must skip `.drop-copy` text.
