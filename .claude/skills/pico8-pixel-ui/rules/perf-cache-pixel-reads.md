---
title: Cache Pixel and Text Measurements
impact: MEDIUM
impactDescription: avoids getImageData and measureText on every frame
tags: perf, cache, weakmap, canvas, fonts, preload
---

## Cache Pixel and Text Measurements

Per-frame collision work must not read pixels or lay out text again.

- Alpha data: once per image, in a `WeakMap<HTMLImageElement, Uint8ClampedArray>`.
- Row spans: per image and `frame w h flip` key.
- Word ink: per `font|word`, only after fonts load.
- Images: decoded once and shared by every sprite that uses them. Preload critical sheets with `preload(src, { as: "image" })` during render, and the rest when idle.

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

Keep a synchronous map of already-decoded images too, so a remounted sprite draws on its first frame instead of waiting a tick.
