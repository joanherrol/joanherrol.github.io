---
title: Only Solid Things Stop Bullets, Never Shadows
impact: HIGH
impactDescription: bullets hit what reads as solid and fly over shadows
tags: combat, collision, covers, dom
---

## Only Solid Things Stop Bullets, Never Shadows

Bullets stop at cards and buttons, image frames, the text lines of titles, and the body and gun sprites of the target character. Shadows, `.drop-copy` text and empty space never stop them. Use plain rectangles: `getBoundingClientRect()` for elements (a tilted frame's rect is close enough), and one `Range.getClientRects()` rect per line of title text. Read covers fresh each frame, only for what is on screen.

**Incorrect (the whole heading block, including the empty space beside short titles):**

```ts
document.querySelectorAll("h2").forEach((h) => covers.push(h.getBoundingClientRect()));
```

**Correct:**

```ts
const COVERS = "main .card-cream, main .card-accent, main .float-body";

function titleLines(title: Element, rects: Rect[]) {
  const range = document.createRange();
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement?.closest(".drop-copy, button")) continue;
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) if (onScreen(r)) rects.push(r);
  }
}

export function spriteRects(track: HTMLElement | null): Rect[] {
  return [...(track?.querySelectorAll("canvas.sprite-solid") ?? [])].map((c) => c.getBoundingClientRect());
}
```

Only the body and gun canvases carry `sprite-solid`; shadow canvases never collide.
