---
title: Draw Sprites as Whole Device-Pixel Blocks
impact: CRITICAL
impactDescription: prevents uneven art pixels (some 2px, some 3px) and smoothing blur
tags: pixel, canvas, sprite, dpr
---

## Draw Sprites as Whole Device-Pixel Blocks

Draw each art pixel on a canvas as a block of `round(scale * dpr)` device pixels, size the backing store in device pixels, and set the CSS size to that divided by `dpr`. Turn smoothing off. Never scale a small `<img>` with CSS alone.

**Incorrect (CSS scaling at 1.25× gives rows of mixed widths):**

```tsx
<img src="/player.png" style={{ width: 8 * 4.3, imageRendering: "pixelated" }} />
```

**Correct:**

```ts
const resize = () => {
  const dpr = window.devicePixelRatio || 1;
  blockSize = Math.max(1, Math.round(scale * dpr));
  canvas.width = w * blockSize;
  canvas.height = h * blockSize;
  canvas.style.width = `${canvas.width / dpr}px`;
  canvas.style.height = `${canvas.height / dpr}px`;
};
const draw = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  if (flip) { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
  ctx.drawImage(img, frame * w, 0, w, h, 0, 0, w * blockSize, h * blockSize);
};
```

Pick `scale` from `artPx()` times a whole number (lane scale 4/5/6 on desktop, 4 on phones), or from a text's glyph pixel when a character stands on lettering (`fontSize / 8`). Snap anything you position from JS with `devicePx()`.
