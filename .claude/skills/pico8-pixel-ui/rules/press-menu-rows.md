---
title: Menu Rows Highlight in Accent; Selected Looks Like Hovered
impact: MEDIUM
impactDescription: one clear selection state in menus, with no outlines or tints
tags: press, menu, dropdown, selection, hover
---

## Menu Rows Highlight in Accent; Selected Looks Like Hovered

Dropdowns are floating cream (or paper) panels with a divided title bar. A row that is hovered or focused fills with the accent colour and cream text. The selected row (the current section, the active palette) uses exactly the same fill, and a small marker (the player sprite, a star) can sit beside it. Selection follows the pointer while the menu is open, so only one row is ever lit. No outlines, underlines or translucent highlights.

**Incorrect:**

```tsx
<button className={`${item} ${selected ? "underline" : ""} hover:bg-black/10`}>…</button>
```

**Correct:**

```ts
export const dropdown = {
  trigger: "pixel-button pixel-cut flex h-[round(up,44px,var(--ipx))] cursor-pointer",
  triggerFace: "pixel-face flex items-center bg-paper",
  panel: "pixel-float pixel-cut pointer-events-auto mt-6",
  panelFace: "pixel-face bg-paper",
  item: "flex w-full cursor-pointer items-center gap-6 whitespace-nowrap px-6 py-4 text-left text-body uppercase leading-none tracking-[0.125em] hover:bg-pico-accent hover:text-cream",
};
```

```tsx
<nav ref={pixelCutRef} className={dropdown.panel}>
  <PixelShadow />
  <div className={dropdown.panelFace}>…rows…</div>
</nav>
```

The panel mounts on open, so it registers its corners with `ref={pixelCutRef}` (see `surface-cut-corners`). The face clips the lit rows to the stepped corners.

```tsx
<button
  onMouseEnter={() => setSelected(i)}
  onFocus={() => setSelected(i)}
  className={`${dropdown.item} ${selected === i ? "bg-pico-accent text-cream" : ""}`}
>
  <span className="flex h-11 w-10 shrink-0 items-center justify-center">
    {selected === i && p > 0 && <Player animation="idle" scale={p} flipX />}
  </span>
  {level.code} {level.label}
</button>
```

When the menu opens, set the selection to the section crossing the middle of the viewport. Draw the marker sprite at `scale = P` so it matches the menu's spacing grid.
