---
title: Use Only the 32 PICO-8 Colours
impact: CRITICAL
impactDescription: one off-palette colour breaks the look; switching the defaults off makes it impossible
tags: color, palette, tailwind, tokens
---

## Use Only the 32 PICO-8 Colours

Turn Tailwind's palette off and define the 16 standard and 16 secret PICO-8 colours as the only colour tokens. In JS, reference tokens (`var(--color-red)`), not hex, except where a canvas API needs a literal colour.

**Incorrect (Tailwind defaults stay typeable):**

```tsx
<p className="text-gray-400">…</p>
<div style={{ background: "#333" }} />
```

**Correct:**

```css
@theme static {
  --color-*: initial;
  --color-black: #000000;       --color-darkest-brown: #291814;
  --color-dark-blue: #1d2b53;   --color-darker-blue: #111d35;
  --color-dark-purple: #7e2553; --color-darker-purple: #422136;
  --color-dark-green: #008751;  --color-blue-green: #125359;
  --color-brown: #ab5236;       --color-dark-brown: #742f29;
  --color-dark-grey: #5f574f;   --color-darker-grey: #49333b;
  --color-light-grey: #c2c3c7;  --color-medium-grey: #a28879;
  --color-white: #fff1e8;       --color-light-yellow: #f3ef7d;
  --color-red: #ff004d;         --color-dark-red: #be1250;
  --color-orange: #ffa300;      --color-dark-orange: #ff6c24;
  --color-yellow: #ffec27;      --color-lime-green: #a8e72e;
  --color-green: #00e436;       --color-medium-green: #00b543;
  --color-blue: #29adff;        --color-true-blue: #065ab5;
  --color-lavender: #83769c;    --color-mauve: #754665;
  --color-pink: #ff77a8;        --color-dark-peach: #ff6e59;
  --color-peach: #ffccaa;       --color-light-peach: #ff9d81;
}
@theme inline {
  --shadow-*: initial;
  --inset-shadow-*: initial;
  --drop-shadow-*: initial;
  --radius-*: initial; /* no rounded corners either */
}
```

```ts
type PicoColor = "black" | "dark-blue" /* …all 32 */;
const pico = (name: PicoColor) => `var(--color-${name})`;
```

`@theme static` emits every colour variable even when unused, so runtime code and palettes can reference any of them.
