---
title: Bullets Move on CSS in Fixed Screen Layers
impact: MEDIUM
impactDescription: smooth bullets with correct depth under content and over characters
tags: combat, bullets, layers, css-animation, clip-path
---

## Bullets Move on CSS in Fixed Screen Layers

Bullets fly across the viewport on a CSS keyframe (`translateX(100vw * dir)` over 1000ms, linear), not a JS position loop. They are `position: fixed` at the screen height they were fired from, so scrolling dodges them. Render the shadow copies in a `z-index: -1` layer, and the bullets in a `-1` layer after it (over characters, under content). On desktop, add a second bullet copy at z 40 clipped to the side lane, so bullets over the lane show above the lane character.

**Correct:**

```css
@keyframes pixel-bullet { to { transform: translateX(calc(100vw * var(--dir, 1))); } }
.shot { animation: pixel-bullet 1000ms linear both; }
.shot.is-left { --dir: -1; }
.player-bullet { background: var(--color-white); }
.enemy-bullet  { background: var(--color-red); }
.shot-shadow   { background: var(--color-black); }
```

```tsx
<div className="pointer-events-none fixed inset-0 z-[-1]">{shots.map((s) => renderShot(s, "shadow"))}</div>
{/* player and enemy tracks */}
<div className="pointer-events-none fixed inset-0 z-[-1]">{shots.map((s) => renderShot(s, "bullet"))}</div>
<div className="pointer-events-none fixed inset-0 z-40">{sparks}</div>
<div className="pointer-events-none fixed inset-0 z-40 [clip-path:inset(0_0_0_calc(100%-var(--lane)))]">
  {shots.map((s) => renderShot(s, "bullet"))}
</div>
```

Snap spawn positions with `devicePx()`. Every copy carries `data-shot={id}` so `land()` can freeze them all together.
