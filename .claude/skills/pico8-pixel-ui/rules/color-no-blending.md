---
title: No Opacity, Alpha or Gradients at Rest
impact: CRITICAL
impactDescription: blended colours fall outside the palette
tags: color, opacity, muted-text, motion
---

## No Opacity, Alpha or Gradients at Rest

Nothing that has settled may blend. Muted text is a muted palette colour: light-grey on dark grounds, dark-grey on light cards. Motion in progress (reveal fades, particles fading out) may cross-fade, as long as the settled result is pure palette.

**Incorrect:**

```tsx
<p className="text-white/60">Caption</p>
<div className="bg-black/50" />
<div style={{ background: "linear-gradient(#1d2b53, #111d35)" }} />
```

**Correct:**

```tsx
<p className="text-light-grey">Caption</p>          {/* on dark */}
<p className="type-body-sm text-dark-grey">Note</p>  {/* on a cream card */}
```

The one allowed gradient is a hard-stop pattern that draws pixels (the section teeth: `linear-gradient(90deg, var(--paper) 50%, transparent 0)`), which never blends.
