---
title: Decode Sprite Images Once and Preload Them
impact: MEDIUM
impactDescription: sprites draw on their first frame and never refetch
tags: perf, cache, weakmap, canvas, fonts, preload
---

## Decode Sprite Images Once and Preload Them

Decode each sheet once and share it with every sprite that uses it. Preload critical sheets with `preload(src, { as: "image" })` during render, and the rest when idle. Keep a synchronous map of decoded images so a remounted sprite draws on its first frame.

**Correct:**

```ts
const imageCache = new Map<string, Promise<HTMLImageElement>>();
function loadImage(src: string) {
  let promise = imageCache.get(src);
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.decode().then(() => resolve(img)).catch(reject);
    });
    imageCache.set(src, promise);
  }
  return promise;
}

export function preloadSpritesWhenIdle(sheets: SpriteSheet[]) {
  const run = () => sheets.forEach(({ src }) => loadImage(src).catch(() => {}));
  if ("requestIdleCallback" in window) requestIdleCallback(run);
  else setTimeout(run, 200);
}
```

