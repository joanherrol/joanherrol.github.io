---
title: Verify the Pixel Rules in a Real Browser
impact: LOW-MEDIUM
impactDescription: catches half pixels, stray stacking contexts and moving hit zones before users do
tags: tooling, playwright, testing, verification
---

## Verify the Pixel Rules in a Real Browser

Script checks with Playwright at 390, 800 and 1440px wide, and at device scale factors 1, 1.25 and 2:

- every text element's `fontSize / 8 * dpr` is an integer;
- every shadowed element's ancestors have no `transform`, `opacity < 1`, `filter`, `sticky` or `container-type` once revealed;
- hovering a pressable's bottom-right edge pixel stays hovered for 500ms (no flicker);
- every `.pixel-cut` has its `--cut` set once the page is visible, with the step count its shorter side calls for;
- a bullet fired at a card stops with its edge exactly on the card face;
- the production build contains no dev-only routes.

**Correct:**

```ts
const bad = await page.evaluate(() =>
  [...document.querySelectorAll<HTMLElement>("body *")]
    .filter((el) => el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()))
    .map((el) => ({ el: el.className, v: (parseFloat(getComputedStyle(el).fontSize) / 8) * devicePixelRatio }))
    .filter(({ v }) => Math.abs(v - Math.round(v)) > 0.01),
);
expect(bad).toEqual([]);
```

With Tailwind v4 under `next dev`, rapid scripted edits to `globals.css` can leave the server serving stale CSS. After editing, touch the file, wait, and fetch the served stylesheet to confirm the change is live before judging a screenshot. Run production builds in a separate copy of the project, never in the directory where the dev server is running.
