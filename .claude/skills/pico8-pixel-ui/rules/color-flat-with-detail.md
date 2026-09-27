---
title: Flat Colour, No Coloured Shading, Details Welcome
impact: HIGH
impactDescription: keeps UI in the same flat style as the character art
tags: color, flat, detail, depth, bevel
---

## Flat Colour, No Coloured Shading, Details Welcome

Don't shade elements with coloured shadows, bevels or darker edges: a window light is a flat square. Hand-drawn details are encouraged, the way sprites have them: highlight pixels on a round button, a pivot on a D-pad, a highlight rim. Depth comes from black drop pixels, not colour.

**Incorrect (bevel and coloured shadow):**

```tsx
<span className="bg-red shadow-[inset_-2px_-2px_0_#be1250]" />
<button className="bg-pink border-b-4 border-dark-purple">Go</button>
```

**Correct (flat faces, drawn highlights, black depth):**

```ts
const ROUND_BUTTON = [
  "....aaaaa.....",
  "..aaaaaaaaa...",
  ".aaawwaaaaaa..", // w: white highlight pixels
  ".aawaaaaaaaa#.", // #: its black drop shadow, down and right
  /* … */
  ".....#####....",
];
const DPAD = [
  "......hhhhhhh......", // h: dark-grey highlight rim on the lit top and left edges
  "......h######......",
  /* … */
  "h#######ddd########", // d: dark-grey pivot in the centre
];
```

```tsx
{/* A recessed screen: black falls along its top and left edges. */}
<div className="bg-black pl-(--p) pt-(--p)">{children}</div>
```

Check a hand-drawn detail is centred by counting rows: in a 19-row D-pad whose arms are 7 wide, the 3×3 pivot sits on rows and columns 8 to 10.
