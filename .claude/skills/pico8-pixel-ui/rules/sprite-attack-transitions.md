---
title: Momentum-Match Idle and Attack Transitions
impact: HIGH
impactDescription: removes the visible jump when a looping idle cuts into an attack and back
tags: sprite, animation, transitions, timing, idle, attack
---

## Momentum-Match Idle and Attack Transitions

Cutting from an arbitrary idle frame into attack frame 0 makes the character jump, because the idle bob is mid-motion. For each character, note:

- which idle frame best leads into the attack (`attackFromIdle`);
- which idle frame best follows the last attack frame (`idleAfterAttack`);
- which leading attack frames fight the idle motion and should be skipped (`attackStart`).

Then schedule the attack for the moment the idle loop reaches `attackFromIdle`, and resume idle from `idleAfterAttack` through `startFrame`.

**Incorrect (fixed interval, restart idle at frame 0):**

```ts
setInterval(() => setAnimation("attack"), 2000);
// …after attack: setAnimation("idle") -> idle restarts at frame 0, visible snap
```

**Correct:**

```ts
const IDLE_FRAMES = 6;
const IDLE_FRAME_MS = 1000 / 12;
const IDLE_CYCLES_PER_ATTACK = 3;

// Idle loops, then on to the idle frame closest to the attack's first frame.
function attackWait({ kind, idleFrom }: EnemyState) {
  const target = kind.attackFromIdle ?? 0;
  const frames =
    IDLE_CYCLES_PER_ATTACK * IDLE_FRAMES + ((target - idleFrom + IDLE_FRAMES) % IDLE_FRAMES);
  return frames * IDLE_FRAME_MS;
}

export function attackTiming(kind: EnemyKind) {
  const frameMs = 1000 / 12;
  const start = kind.attackStart ?? 0;
  return {
    duration: (kind.attackFrames - start) * frameMs,
    shots: kind.fireFrames.map((f) => (f - start) * frameMs),
  };
}

useEffect(() => {
  if (!attackReady) return; // visible, not walking, both alive, not already attacking
  const timer = setTimeout(() => {
    const { kind } = enemyRef.current;
    const { duration, shots } = attackTiming(kind);
    setEnemy((e) => ({ ...e, attacking: true }));
    setTimeout(() =>
      setEnemy((e) => (e.kind === kind ? { ...e, attacking: false, idleFrom: kind.idleAfterAttack ?? 0 } : e)),
      duration);
    for (const at of shots) setTimeout(() => shootBack(kind), at);
  }, attackWait(enemyRef.current));
  return () => clearTimeout(timer);
}, [attackReady]);
```

```tsx
<PixelSprite
  sheet={sheet(kind, animation)}
  loop={animation !== "attack"}
  startFrame={animation === "attack" ? (kind.attackStart ?? 0) : idleFrom}
/>
```

Each shot callback re-checks that the same kind is still alive, idle and not walking before firing, so a shot scheduled before a death or scroll never fires. Walking resets `idleFrom` to 0. Get it all working with a fixed-step sprite clock (`perf-fixed-step-clock`), because the timers and the frames must agree.
