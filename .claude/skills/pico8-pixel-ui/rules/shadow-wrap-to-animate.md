---
title: Never Animate a Shadowed Element, Animate a Wrapper
impact: CRITICAL
impactDescription: animating the element makes it a stacking context that lifts its own shadow
tags: shadow, animation, reveal, transform
---

## Never Animate a Shadowed Element, Animate a Wrapper

A shadowed element must never transform or animate itself. Put the reveal, bob or tilt on a wrapper, or split the element into separate shadow and body elements. For moving pressables, move with `top`/`left` offsets, not transforms (see `press-float-raise`).

**Incorrect (the card is both revealed and shadowed):**

```tsx
<li data-reveal className="card-cream pixel-float">…</li>
```

**Correct:**

```tsx
<li data-reveal>
  <div className="card-cream pixel-float">…</div>
</li>
```

A floating frame uses two siblings instead of a pseudo: the shadow tilts along with the body but never bobs, so it reads as the ground.

```tsx
<figure data-reveal className="relative" style={{ "--tilt": `${tilt}deg`, "--float-delay": `${-delay}s` }}>
  <div aria-hidden="true" className="float-shadow" />
  <div className="float-body bg-cream">{children}</div>
</figure>
```

```css
.float-body, .float-shadow { rotate: var(--tilt, 0deg); }
.float-shadow { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.float-shadow::before { /* same grown black copy as .pixel-float::before */ }
@keyframes float-tilt {
  from { rotate: calc(var(--tilt, 0deg) - 1deg); }
  to   { rotate: calc(var(--tilt, 0deg) + 1deg); }
}
@keyframes float-bob { to { translate: 0 calc(var(--px) * -2); } }
@media (prefers-reduced-motion: no-preference) {
  .float-shadow { animation: float-tilt 5s ease-in-out var(--float-delay, 0s) infinite alternate; }
  .float-body {
    animation:
      float-tilt 5s ease-in-out var(--float-delay, 0s) infinite alternate,
      float-bob 2s ease-in-out var(--float-delay, 0s) infinite alternate;
  }
}
```

The tilting body forms its own stacking context, which is fine because its shadow is a sibling, not a child.
