---
title: Two Image Frames: Window and Console
impact: MEDIUM
impactDescription: pictures framed without borders, in the system's own vocabulary
tags: surface, frames, window, console, images
---

## Two Image Frames: Window and Console

- **Window frame:** a cream title bar with three flat lights, each outlined in its own darker hue, and an uppercase title. The image sits directly below with no divider or border; the image itself gives the contrast. Menus use the same bar with a light-grey divider, because their list below is also cream.
- **Console frame:** a cream body, a black D-pad with a dark-grey highlight rim and pivot, a dark-grey bezel with a power light and label, a recessed screen, and two accent round buttons with white highlight pixels and a black drop pixel. Every art piece is drawn one art pixel per P.

**Incorrect:**

```tsx
<div className="rounded-lg border-4 border-black p-2"><img … /></div>
```

**Correct:**

```tsx
<FloatFrame tilt={-1} bodyClassName="bg-cream">
  <TitleBar title="Game" />
  <Image … />
</FloatFrame>

<FloatFrame tilt={1} bodyClassName="flex items-center justify-between gap-6 bg-cream px-6 py-8">
  <PixelArt rows={DPAD} colors={DPAD_COLORS} className="w-19 shrink-0" />
  <div className="min-w-0 flex-1 bg-dark-grey px-3 pb-3">
    <div className="flex items-center gap-[0.5em] py-[0.375em] text-body uppercase leading-none tracking-[0.125em] text-cream">
      <span className="size-[0.625em] border-[0.125em] border-dark-red bg-red" />
      P1
    </div>
    <div className="bg-black pl-(--p) pt-(--p)">{children}</div>
  </div>
  <div className="relative size-25 shrink-0">
    <PixelArt rows={ROUND_BUTTON} colors={BUTTON_COLORS} className="absolute bottom-0 left-0 w-14" />
    <PixelArt rows={ROUND_BUTTON} colors={BUTTON_COLORS} className="absolute right-0 top-0 w-14" />
  </div>
</FloatFrame>
```

Add depth only to parts that already exist (a highlight rim, a drop pixel, a recess). Don't add decorations like speaker grilles, pills or letters.
