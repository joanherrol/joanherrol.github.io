---
title: Burst From the Frame on Screen, Then Slide Back In
impact: MEDIUM
impactDescription: deaths never wait on a download and respawns never flash
tags: sprite, particles, death, respawn, transitions
---

## Burst From the Frame on Screen, Then Slide Back In

On death, read the pixels of the canvas that is on screen right now, and turn each coloured art pixel into a particle flying outward from the centre with some random spread. Hide the sprite instantly (`is-snapped` switches its transition off), swap in the next character halfway through the burst, then slide it in on the second animation frame so the transition runs.

**Correct:**

```ts
function canvasPixels(canvas: HTMLCanvasElement | null, width: number, height: number) {
  const ctx = canvas?.width ? canvas.getContext("2d") : null;
  if (!canvas || !ctx) return [];
  const block = canvas.width / width;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pixels = [];
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const i = (Math.floor((y + 0.5) * block) * canvas.width + Math.floor((x + 0.5) * block)) * 4;
      if (data[i + 3] >= 128) pixels.push({ x, y, color: `rgb(${data[i]} ${data[i + 1]} ${data[i + 2]})` });
    }
  return pixels;
}

function burstPieces(pixels: Pixel[], width: number, height: number) {
  return pixels.map(({ x, y, color }) => {
    const angle = Math.atan2(y + 0.5 - height / 2, x + 0.5 - width / 2) + (Math.random() - 0.5) * 0.5;
    const distance = 4 + Math.random() * 8;
    return { x, y, color, dx: Math.round(Math.cos(angle) * distance), dy: Math.round(Math.sin(angle) * distance) };
  });
}

function slideInAfterBurst(respawn: () => void, show: () => void, after = 250) {
  setTimeout(() => {
    respawn();                                                  // phase "gone": off screen, no transition
    requestAnimationFrame(() => requestAnimationFrame(show));   // then "alive": slides in
  }, after);
}
```

```css
.enemy-drop { transition: transform 500ms var(--ease-soft), opacity 350ms ease-out; }
.enemy-drop.is-hidden { transform: translateX(160%); opacity: 0; }
.enemy-drop.is-snapped { opacity: 0; transition: none; }
.pixel-burst { animation: pixel-burst-move 500ms var(--ease-out) forwards, pixel-burst-fade 500ms ease-in forwards; }
```

Update the state ref synchronously (`enemyRef.current = next`) before `setState`, so two bullets arriving in the same frame can't both deal the killing hit.
