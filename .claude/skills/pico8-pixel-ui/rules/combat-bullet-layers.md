---
title: Bullets Move in the Game Loop, in Fixed Screen Layers
impact: MEDIUM
impactDescription: bullets never drawn past a hit, with correct depth under content and over characters
tags: combat, bullets, layers, raf, clip-path
---

## Bullets Move in the Game Loop, in Fixed Screen Layers

Move bullets from the same `requestAnimationFrame` loop that checks collisions: `x = spawnX + dir * speed * (now - born)`, snapped with `devicePx()` and written as a `translateX` on every copy. Don't use a CSS keyframe: it runs on the compositor thread and keeps moving bullets past covers whenever the main thread is late. Bullets are `position: fixed` at the screen height they were fired from, so scrolling dodges them. Render shadow copies in a `z-index: -1` layer and bullets in a `-1` layer after it (over characters, under content). On desktop, add a second bullet copy at z 40 clipped to the side lane, so bullets over the lane show above the lane character.

**Incorrect (compositor-driven; the collision loop can only chase it):**

```css
.shot { animation: pixel-bullet 1000ms linear both; }
```

**Correct:**

```ts
const speed = prefersReducedMotion() ? 0 : window.innerWidth / BULLET_MS;
const to = devicePx(shot.x + dir * speed * (now - shot.born));
// …hit test from last position to `to`, then:
function place(shot: Shot, x: number) {
  for (const el of document.querySelectorAll<HTMLElement>(`[data-shot="${shot.id}"]`))
    el.style.transform = `translateX(${x - shot.x}px)`;
}
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

Every copy carries `data-shot={id}` so one write moves them all.
