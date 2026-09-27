---
title: A Dev-Only Design Sheet With a Live Token Tuner
impact: LOW-MEDIUM
impactDescription: refine the system visually with a collaborator before touching pages
tags: tooling, design-sheet, next, dev-only, tokens
---

## A Dev-Only Design Sheet With a Live Token Tuner

Build a page that renders every token and part, independent of any real page: all 15 text styles with measured sizes, the 32 colours and 3 theme roles with measured hex values, the spacing scale with measured widths, shadows (floating, and a button at rest, hover and pressed), the shared parts, and both image frames with a placeholder picture. Add a tuner that rewrites `--p` and the `--fp-*` tokens as whole multiples of `--ipx`, and outputs a snippet to paste back into the CSS. Keep it out of production with a dev-only page extension.

**Correct:**

```ts
// next.config.ts
const nextConfig: NextConfig = {
  pageExtensions: process.env.NODE_ENV === "development" ? ["dev.tsx", "tsx", "ts"] : ["tsx", "ts"],
};
// app/design/page.dev.tsx exists only in `next dev`
```

```ts
const set = (name: string, n: number) => {
  document.documentElement.style.setProperty(name, `calc(var(--ipx) * ${n})`);
};
// Measure what actually rendered, not what the CSS says:
el.textContent = `${size}px · pixel ${size / 8}px`;
```

Put the tuner's `sticky` on a wrapper, never on the shadowed card (see `shadow-ground-layer`). Show state (rest, hover, pressed) by setting `--raise` inline on static copies.
