---
title: Run Game Loops Only While Something Moves
impact: MEDIUM
impactDescription: zero per-frame work while no bullet is flying
tags: perf, raf, react, effects, refs
---

## Run Game Loops Only While Something Moves

One loop moves bullets and checks their hits. Start it when the first bullet exists and stop it when the last one is gone, by deriving a boolean from state and using it as the effect's dependency. Keep live game data in refs (a `Map` of live shots), so the loop never needs React state.

**Incorrect:**

```ts
useEffect(() => {
  const loop = () => { check(shots); raf = requestAnimationFrame(loop); };
  loop();
}, [shots]); // restarts every time a shot is added or removed, and runs forever
```

**Correct:**

```ts
const flying = shots.length > 0;
useEffect(() => {
  if (!flying) return;
  let raf = 0;
  const tick = () => {
    const covers = readCovers();
    for (const shot of live.current.values()) advance(shot, covers, last, before);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [flying, advance]);

function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => { ref.current = value; }, [value]);
  return ref;
}
```

Timers and listeners read `useLatest` refs instead of re-subscribing whenever state changes. Remove a shot from `live` the moment it lands, so a second hit on the same frame is ignored.
