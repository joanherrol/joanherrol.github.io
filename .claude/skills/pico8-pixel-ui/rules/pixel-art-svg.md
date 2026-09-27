---
title: Hand-Draw UI Art as String Rows Rendered to SVG
impact: MEDIUM
impactDescription: crisp, recolourable, token-driven art without image files
tags: pixel, svg, art, tokens
---

## Hand-Draw UI Art as String Rows Rendered to SVG

For UI pieces (D-pads, console buttons, icons), write rows of characters, one per art pixel, and map each character to a palette token. Merge each colour into one `<path>` and render with `shapeRendering="crispEdges"`. Size the SVG in whole P or glyph pixels.

**Correct:**

```tsx
export function PixelArt({ rows, colors, className = "" }: {
  rows: readonly string[];
  colors: Record<string, string>;
  className?: string;
}) {
  const paths: Record<string, string> = {};
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch !== ".") paths[ch] = `${paths[ch] ?? ""}M${x} ${y}h1v1h-1z`;
    }),
  );
  return (
    <svg viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {Object.entries(paths).map(([ch, d]) => <path key={ch} d={d} fill={colors[ch]} />)}
    </svg>
  );
}

const BUTTON_COLORS = {
  a: "var(--pico-accent)",
  w: "var(--color-white)",   // highlight pixels
  "#": "var(--color-black)", // its own 1-pixel drop shadow, down and right
};
<PixelArt rows={ROUND_BUTTON} colors={BUTTON_COLORS} className="w-14" /> // 14 cols = 14 P
```

Keep every art piece in one component on the same pixel (all console art on P), so the sizes never mix.
