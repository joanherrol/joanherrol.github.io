---
title: Declare Click Sounds With data-sound, One Listener
impact: MEDIUM
impactDescription: server components click too; no per-component audio code
tags: press, sound, audio, delegation, server-components
---

## Declare Click Sounds With data-sound, One Listener

Every pressable plays a sound. Elements declare which one with `data-sound`, and one delegated document listener plays it, so server-rendered links need no client code. Audio is off by default and remembered. Files load only once sound is on, and the context starts inside a user gesture.

**Incorrect:**

```tsx
"use client";
<a href="/cv.pdf" onClick={() => playSound("ui")}>CV</a>
```

**Correct:**

```tsx
<a href="/cv.pdf" download data-sound="ui" className={buttonClasses}>CV</a>
<a href="#about" data-sound="start">Press start</a>
```

```ts
export function listenForSoundClicks() {
  const onClick = (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>("[data-sound]");
    // Phones open downloads at once, so the sound would play on return.
    if (el?.matches("a[download]") && matchMedia("(pointer: coarse)").matches) return;
    const name = el?.dataset.sound;
    if (name && name in SOUNDS) playSound(name as SoundName);
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
```

Normalise every file to its measured loudness (`gain = 10 ** ((level - LOUDNESS[file]) / 20)`), keep levels subtle (around −40 dB), and jitter the playback rate ±6% so repeated shots don't drone. Pitch enemy shots higher than the player's (rate 1.6 against 0.85).
