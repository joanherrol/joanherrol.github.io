---
title: Only Solid Things Stop Bullets, Never Shadows
impact: HIGH
impactDescription: bullets hit what reads as solid and fly over shadows
tags: combat, collision, covers, dom
---

## Only Solid Things Stop Bullets, Never Shadows

Bullets stop at cards and buttons, image frames, the text lines of titles (a marked word's accent ring included), and the body sprite of the target character (not its gun). Shadows, `.drop-copy` text and empty space never stop them. Use plain rectangles: `getBoundingClientRect()` for elements (a tilted frame's rect is close enough), and one `Range.getClientRects()` rect per line of title text. Read covers fresh each frame, only for what is on screen.

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
    const parent = node.parentElement;
    if (!parent || parent.closest(".drop-copy, button")) continue;
    // A marked word's accent ring is part of it; its shadow is not.
    const ring = parent.closest(".text-mark") ? Number.parseFloat(getComputedStyle(parent).fontSize) / 8 : 0;
    range.selectNodeContents(node);
    for (const r of range.getClientRects())
      if (onScreen(r)) rects.push({ left: r.left - ring, top: r.top - ring, right: r.right + ring, bottom: r.bottom + ring });
  }
}

export function spriteRects(track: HTMLElement | null): Rect[] {
  return [...(track?.querySelectorAll("canvas.sprite-solid") ?? [])].map((c) => c.getBoundingClientRect());
}
```

Only the body canvas carries `sprite-solid`; the gun and shadow canvases never collide.
