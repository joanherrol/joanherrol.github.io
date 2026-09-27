---
title: Align Every Character's Shadow to One Floor Row
impact: MEDIUM
impactDescription: player and enemies stand on the same ground despite different sprite sizes
tags: sprite, shadow, alignment, layout
---

## Align Every Character's Shadow to One Floor Row

Characters of different heights must share one ground line. Give every character the same box height (11 rows for an 8×10 player with a 3-row shadow starting at row 9), then raise each enemy so the first visible row of its shadow lines up with the player's.

**Incorrect (bottom-aligning boxes: tall shadows float, short ones sink):**

```tsx
<div className="absolute bottom-0 right-0"><Enemy kind={kind} /></div>
```

**Correct:**

```ts
const BOX_HEIGHT = 11;
const PLAYER_SHADOW_TOP = 9;
// Rows to raise an enemy so its shadow top lines up with the player's.
function enemyLift(kind: EnemyKind) {
  return BOX_HEIGHT - PLAYER_SHADOW_TOP - kind.shadowHeight + kind.shadowTop;
}
```

```tsx
<div className="relative" style={{ height: BOX_HEIGHT * scale }}>
  <button className="absolute right-0" style={{ bottom: enemyLift(kind) * scale }}>
    <Enemy kind={kind} scale={scale} animation={animation} />
  </button>
</div>
```

Use the same lift for the death burst, so the pieces start exactly where the sprite was.
