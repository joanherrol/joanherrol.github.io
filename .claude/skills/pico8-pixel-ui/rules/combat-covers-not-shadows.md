---
title: Only Solid Things Stop Bullets, Never Shadows
impact: HIGH
impactDescription: bullets hit what the eye reads as solid, and fly over shadows and gaps
tags: combat, collision, covers, dom, text-metrics
---

## Only Solid Things Stop Bullets, Never Shadows

Bullets stop at:

- cards and buttons (their border box);
- image frames, as oriented boxes using their computed `rotate` and untransformed size;
- the ink of title words, not the line box or the gaps between words;
- the coloured pixels of sprites.

Shadows, `.drop-copy` text and empty space never stop them. Read covers fresh each frame, only for elements on screen.

**Incorrect (whole heading boxes and bounding rects of tilted frames):**

```ts
document.querySelectorAll("h2, figure").forEach((el) => covers.push(el.getBoundingClientRect()));
```

**Correct:**

```ts
export type Cover = { key: string; cx: number; cy: number; hw: number; hh: number; cos: number; sin: number };

// Tilted frame: centre from the rect, half extents from the untransformed box.
const angle = ((Number.parseFloat(getComputedStyle(el).rotate) || 0) * Math.PI) / 180;
covers.push({
  key: `f${i}`, cx: r.left + r.width / 2, cy: r.top + r.height / 2,
  hw: el.offsetWidth / 2, hh: el.offsetHeight / 2, cos: Math.cos(angle), sin: Math.sin(angle),
});

// Title words: a Range per word, trimmed to its ink with canvas measureText.
function ink(font: string, word: string) {
  const m = ctx.measureText(word); // ctx.font = font
  return {
    left: -m.actualBoundingBoxLeft,
    right: m.actualBoundingBoxRight,
    top: m.fontBoundingBoxAscent - m.actualBoundingBoxAscent,
    bottom: m.fontBoundingBoxAscent + m.actualBoundingBoxDescent,
  };
}
// Skip the shadow copy; widen marked words by their ring (fontSize / 8); measure uppercased text if text-transform is uppercase.
if (parent.closest(".drop-copy, button")) continue;
```

Cache ink metrics per font and word, but only once `document.fonts.status === "loaded"`. Before then the metrics belong to the fallback font.
