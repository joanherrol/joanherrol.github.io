---
title: The Hit Zone Never Moves
impact: HIGH
impactDescription: stops hover flicker when the cursor sits on a moving button's edge
tags: press, pointer-events, hover, hit-testing
---

## The Hit Zone Never Moves

When a face lifts on hover, a cursor on its bottom or right edge ends up outside it, so it drops, re-enters, lifts again, and flickers. The host never moves, so it is the hit zone: it takes the pointer and the face ignores it. `:hover` and `:active` match on the host and move only the face.

**Incorrect (the element's own box moves out from under the cursor):**

```css
.pixel-button:hover { translate: -0.125em -0.125em; }
```

**Correct:**

```css
.pixel-button { pointer-events: auto; }
.pixel-button > .pixel-face { pointer-events: none; }
.pixel-button:hover > .pixel-face { translate: -0.125em -0.125em; }
```

Set `pointer-events: auto` on the host explicitly: fixed menus are `pointer-events-none` so they don't block the page, and the host must still take clicks inside them. Delegated handlers (`data-sound`, links) sit on the host, so the click target is always the host.
