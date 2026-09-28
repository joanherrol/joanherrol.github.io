# PICO-8 Pixel UI

**Version 1.0.0**

> **Note:**
> This document is for agents and LLMs to follow when building, maintaining or refactoring a PICO-8-style pixel UI and its game layer.
> It is compiled from `rules/` by `scripts/build-agents.mjs`; edit the rules, not this file.

---

## Abstract

A strict design system for flat pixel-art web UIs that sit alongside PICO-8-style game characters, plus the techniques for animating those characters, their shadows, shots and collisions on a web page. It holds 45 rules across 10 categories, ordered by impact from critical (the pixel grid, colour, shadows and layers) to supporting (performance and tooling). Each rule explains why it matters and shows incorrect and correct code. The reference implementation is a Next.js 16, React 19 and Tailwind CSS v4 portfolio; `templates/` holds its core files.

---

## Table of Contents

1. [Pixel Grid](#1-pixel-grid) — **CRITICAL**
   - 1.1 [Define One Device-Aligned Pixel (--ipx)](#11-define-one-devicealigned-pixel-ipx)
   - 1.2 [Build Every Length From Whole Device Pixels](#12-build-every-length-from-whole-device-pixels)
   - 1.3 [Count Spacing in Base Pixels (P)](#13-count-spacing-in-base-pixels-p)
   - 1.4 [Size by Width and Height; Lay Out by Width and Orientation](#14-size-by-width-and-height-lay-out-by-width-and-orientation)
   - 1.5 [Size Text-Bound Details in Glyph Pixels (0.125em)](#15-size-textbound-details-in-glyph-pixels-0125em)
   - 1.6 [Draw Sprites as Whole Device-Pixel Blocks](#16-draw-sprites-as-whole-devicepixel-blocks)
   - 1.7 [Hand-Draw UI Art as String Rows Rendered to SVG](#17-handdraw-ui-art-as-string-rows-rendered-to-svg)
2. [Colour](#2-colour) — **CRITICAL**
   - 2.1 [Use Only the 32 PICO-8 Colours](#21-use-only-the-32-pico8-colours)
   - 2.2 [No Opacity, Alpha or Gradients at Rest](#22-no-opacity-alpha-or-gradients-at-rest)
   - 2.3 [Flat Colour, No Coloured Shading, Details Welcome](#23-flat-colour-no-coloured-shading-details-welcome)
   - 2.4 [Themes Swap Three Roles, Applied Before Paint](#24-themes-swap-three-roles-applied-before-paint)
3. [Shadows and Layers](#3-shadows-and-layers) — **CRITICAL**
   - 3.1 [Draw Every Shadow in Title Pixels (--s)](#31-draw-every-shadow-in-title-pixels-s)
   - 3.2 [Shadows Are Solid Same-Shape Copies, Never Bands](#32-shadows-are-solid-sameshape-copies-never-bands)
   - 3.3 [Keep Shadows on a Ground Layer With No Stacking Contexts Above](#33-keep-shadows-on-a-ground-layer-with-no-stacking-contexts-above)
   - 3.4 [Never Animate a Shadowed Element, Animate a Wrapper](#34-never-animate-a-shadowed-element-animate-a-wrapper)
   - 3.5 [Title Shadows Are a Black Text Copy on the Ground](#35-title-shadows-are-a-black-text-copy-on-the-ground)
   - 3.6 [Characters and Bullets Use Only Top-Down Ground Shadows](#36-characters-and-bullets-use-only-topdown-ground-shadows)
4. [Typography](#4-typography) — **HIGH**
   - 4.1 [Font Size Is Always 8 Whole Glyph Pixels](#41-font-size-is-always-8-whole-glyph-pixels)
   - 4.2 [Fifteen Text Styles: Five Roles × lg, md, sm](#42-fifteen-text-styles-five-roles-lg-md-sm)
   - 4.3 [Press Start Only for Display and Headlines](#43-press-start-only-for-display-and-headlines)
   - 4.4 [Line Heights in Eighths, Tracking in Whole Glyph Pixels](#44-line-heights-in-eighths-tracking-in-whole-glyph-pixels)
5. [Pressables and Motion](#5-pressables-and-motion) — **HIGH**
   - 5.1 [Pressables Float, Lift One Own Pixel, Press Flush](#51-pressables-float-lift-one-own-pixel-press-flush)
   - 5.2 [The Hit Zone Never Moves](#52-the-hit-zone-never-moves)
   - 5.3 [Menu Rows Highlight in Accent; Selected Looks Like Hovered](#53-menu-rows-highlight-in-accent-selected-looks-like-hovered)
   - 5.4 [Image Frames Start Upright, Then Bob and Sway; Their Shadow Only Sways](#54-image-frames-start-upright-then-bob-and-sway-their-shadow-only-sways)
   - 5.5 [Reveals, Hurt Flashes and Reduced Motion](#55-reveals-hurt-flashes-and-reduced-motion)
   - 5.6 [Declare Click Sounds With data-sound, One Listener](#56-declare-click-sounds-with-datasound-one-listener)
6. [Outlines and Surfaces](#6-outlines-and-surfaces) — **MEDIUM-HIGH**
   - 6.1 [Surfaces Have Stair-Stepped Corners](#61-surfaces-have-stairstepped-corners)
   - 6.2 [No Black Outlines, With a Short List of Exceptions](#62-no-black-outlines-with-a-short-list-of-exceptions)
   - 6.3 [Two Image Frames: Window and Console](#63-two-image-frames-window-and-console)
7. [Sprites and Animation](#7-sprites-and-animation) — **HIGH**
   - 7.1 [Horizontal Strip Sheets With Typed Metadata](#71-horizontal-strip-sheets-with-typed-metadata)
   - 7.2 [Compose Characters From Layered Sprites](#72-compose-characters-from-layered-sprites)
   - 7.3 [Align Every Character's Shadow to One Floor Row](#73-align-every-characters-shadow-to-one-floor-row)
   - 7.4 [Momentum-Match Idle and Attack Transitions](#74-momentummatch-idle-and-attack-transitions)
   - 7.5 [Spawn Shots Flush With the Muzzle on the Recoil Frame](#75-spawn-shots-flush-with-the-muzzle-on-the-recoil-frame)
   - 7.6 [Burst From the Frame on Screen, Then Slide Back In](#76-burst-from-the-frame-on-screen-then-slide-back-in)
8. [Combat: Bullets, Collisions, Effects](#8-combat-bullets-collisions-effects) — **MEDIUM-HIGH**
   - 8.1 [Bullets Move in the Game Loop, in Fixed Screen Layers](#81-bullets-move-in-the-game-loop-in-fixed-screen-layers)
   - 8.2 [Only Solid Things Stop Bullets, Never Shadows](#82-only-solid-things-stop-bullets-never-shadows)
   - 8.3 [Simple Swept Hitboxes; the Bullet Disappears on the First Hit](#83-simple-swept-hitboxes-the-bullet-disappears-on-the-first-hit)
9. [Performance](#9-performance) — **MEDIUM**
   - 9.1 [Fixed-Step Sprite Clock That Sleeps Between Frames](#91-fixedstep-sprite-clock-that-sleeps-between-frames)
   - 9.2 [Run Game Loops Only While Something Moves](#92-run-game-loops-only-while-something-moves)
   - 9.3 [Decode Sprite Images Once and Preload Them](#93-decode-sprite-images-once-and-preload-them)
   - 9.4 [Drive Scroll-Linked Motion on the Compositor, in Whole-Pixel Steps](#94-drive-scrolllinked-motion-on-the-compositor-in-wholepixel-steps)
10. [Tooling](#10-tooling) — **LOW-MEDIUM**
   - 10.1 [A Dev-Only Design Sheet With a Live Token Tuner](#101-a-devonly-design-sheet-with-a-live-token-tuner)
   - 10.2 [Verify the Pixel Rules in a Real Browser](#102-verify-the-pixel-rules-in-a-real-browser)

---

## 1. Pixel Grid

**Impact: CRITICAL**

The one rule everything else serves: nothing ever renders a half pixel. Every length is a whole number of device pixels, scaled by whole steps.

### 1.1 Define One Device-Aligned Pixel (--ipx)

**Impact: CRITICAL (prevents blurry glyphs and seams at 125%, 150% and 175% zoom)**

`1px` in CSS is not one device pixel once the page is zoomed or the screen has a fractional ratio. Set `--ipx` to the CSS length of one whole device pixel before first paint, and again on zoom (zoom fires `resize`). Every other length is built from it.

**Incorrect (1px is 1.25 device pixels at 125% zoom, so 3px renders as 3.75):**

```css
:root { --unit: 1px; }
.card { padding: calc(var(--unit) * 3); }
```

**Correct (a blocking inline script sets it before paint):**

```ts
// lib/pixel.ts
export const pixelBootScript = `(function(){var r=document.documentElement;function s(){var d=window.devicePixelRatio||1;r.style.setProperty("--ipx",Math.max(1,Math.round(d))/d+"px")}s();addEventListener("resize",s)})()`;

/** One art pixel: about 1px, snapped to a whole number of device pixels. */
export function artPx() {
  const d = window.devicePixelRatio || 1;
  return Math.max(1, Math.round(d)) / d;
}

/** The nearest length that covers a whole number of device pixels. */
export function devicePx(px: number) {
  const d = window.devicePixelRatio || 1;
  return Math.round(px * d) / d;
}
```

```tsx
// app/layout.tsx, first thing in <body>
<script dangerouslySetInnerHTML={{ __html: pixelBootScript }} />
```

```css
:root { --ipx: 1px; } /* fallback until the script runs */
```

`round(dpr) / dpr` gives 1px at 1×, 0.8px at 1.25× (one device pixel is 0.8 CSS px), and 1px at 2× (one art pixel is two device pixels on retina, still whole).

### 1.2 Build Every Length From Whole Device Pixels

**Impact: CRITICAL (the single overriding rule; any fractional length breaks the pixel look)**

Fixed lengths are `calc(var(--ipx) * n)` with integer `n`. Fluid lengths that follow the viewport are snapped with CSS `round(value, var(--ipx))`. Layout widths (column fractions, percentages, `max-width` caps) may be fluid, but anything drawn inside them keeps whole pixels.

**Incorrect (rem and vw produce fractional device pixels):**

```css
h2 { font-size: 2.2rem; }
.gap { gap: 1.5vw; }
.border { border-width: 0.1em; }
```

**Correct:**

```css
:root {
  --gap-md: round(clamp(1rem, 3svh, 2rem), var(--ipx));
  --fp-headline-md: round(
    clamp(calc(var(--ipx) * 3), min(0.475vw, 0.75svh), calc(var(--ipx) * 7)),
    var(--ipx)
  );
}
.min-tap { height: round(up, 44px, var(--ipx)); }
```

`em` is fine only when the em itself is whole pixels: in text whose font size is 8 × a whole glyph pixel, `0.125em` is exactly one glyph pixel (see `pixel-em-glyph-units`).

### 1.3 Count Spacing in Base Pixels (P)

**Impact: CRITICAL (keeps every gap and padding on the pixel grid and scales them by whole steps)**

The base pixel `--p` is 2 device pixels on phones and 3 from 40rem. Point Tailwind's spacing scale at it so `p-6` means 6 P. Register `--p` as a `<length>` so scripts can read its resolved value.

**Incorrect (Tailwind's default 0.25rem step is 4px, not a device multiple at every zoom):**

```css
@import "tailwindcss";
```

**Correct:**

```css
@property --p {
  syntax: "<length>";
  inherits: true;
  initial-value: 2px;
}
@theme inline {
  --spacing: var(--p);
}
:root { --p: calc(var(--ipx) * 2); }
@media (width >= 40rem) {
  :root { --p: calc(var(--ipx) * 3); }
}
```

```ts
/** The base pixel P in CSS px, from the registered --p. */
export function basePx() {
  const root = document.documentElement;
  return Number.parseFloat(getComputedStyle(root).getPropertyValue("--p")) || 2;
}
```

Arbitrary spacing is `calc(var(--p) * n)`. Hand-drawn UI art (a D-pad, console buttons) is drawn one art pixel per P, so `w-19` is exactly 19 art pixels. For a React value that follows resize, wrap `basePx` in `useSyncExternalStore` with a server snapshot of `0`, in its own client module.

### 1.4 Size by Width and Height; Lay Out by Width and Orientation

**Impact: HIGH (landscape phones and portrait tablets stay balanced instead of inheriting the wrong sizes)**

A landscape phone is wider than 40rem but only about 400px tall. If sizes follow width alone, it gets desktop type and spacing and every section overflows. A portrait tablet is the opposite case: width-driven headlines come out small on a tall screen.

- **Sizes** (P, glyph tokens, and `sm:` paddings and text) need both width ≥ 40rem and height ≥ 30rem. Short screens keep phone sizes.
- **Layout** (column counts, spans, flex direction) follows width only, with `min-[40rem]:` or `md:`, and orientation where it matters.
- **Short screens** (`short:` = width ≥ 40rem and height < 30rem): use two columns for text and image, cap images by `svh`, and add top padding that clears the fixed corner menus.
- **Portrait tablets:** headline and display medium scale more with width, and text-plus-image sections stack.
- **Optional copy** that would push a section past one screen is hidden by measuring, not by guessing breakpoints.

**Incorrect:**

```css
@media (width >= 40rem) { :root { --p: calc(var(--ipx) * 3); --fp-body-md: calc(var(--ipx) * 3); } }
```

```tsx
<div className="grid md:grid-cols-2">…</div> {/* narrow columns on portrait tablets */}
```

**Correct:**

```css
@custom-variant sm (@media (width >= 40rem) and (height >= 30rem));
@custom-variant short (@media (width >= 40rem) and (height < 30rem));

@media (width >= 40rem) and (height >= 30rem) {
  :root { --p: calc(var(--ipx) * 3); /* …desktop glyph tokens */ }
}
@media (width >= 40rem) and (height >= 30rem) and (orientation: portrait) {
  :root {
    --fp-display-md: round(clamp(4.5px, 1.4vw, 11px), var(--ipx));
    --fp-headline-md: round(clamp(calc(var(--ipx) * 3), min(0.7vw, 0.75svh), calc(var(--ipx) * 7)), var(--ipx));
  }
}
@media (width >= 40rem) and (height < 30rem) {
  :root { --section-pt: calc(var(--edge) + round(up, 44px, var(--ipx)) + var(--p) * 4); }
}
```

```tsx
<div className="grid short:grid-cols-[1fr_1.1fr] md:landscape:grid-cols-[1fr_1.1fr] lg:grid-cols-[1fr_1.1fr]">
  <Text />
  <WindowFrame className="max-w-[min(100%,50svh)] short:max-w-[80svh]! md:landscape:max-w-none lg:max-w-none" />
</div>
```

```tsx
// Marks the section data-crowded when optional notes would push it past one screen.
export function FitNotes() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const fit = () => {
      delete section.dataset.crowded;
      const limit = Number.parseFloat(getComputedStyle(section).minHeight);
      if (section.getBoundingClientRect().height > limit + 0.5) section.dataset.crowded = "";
    };
    fit();
    document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return <span ref={ref} hidden />;
}
// <p className="type-body-sm text-dark-grey in-data-crowded:hidden">…</p>
```

**Installed web apps:** a site saved to the iOS home screen draws under the status bar and home indicator. Set `viewportFit: "cover"` (Next.js `export const viewport`) and add `env(safe-area-inset-*)` to everything placed against a screen edge: fixed menus, section padding, the character tracks, and the footer's bottom padding. In a normal browser the insets are 0, so nothing else changes.

```css
:root {
  --safe-t: env(safe-area-inset-top, 0px);
  --safe-r: env(safe-area-inset-right, 0px);
  --safe-b: env(safe-area-inset-bottom, 0px);
  --safe-l: env(safe-area-inset-left, 0px);
  --section-pt: calc(var(--section-py) + var(--safe-t));
}
```

```tsx
<div className="fixed left-[calc(var(--edge)+var(--safe-l))] top-[calc(var(--edge)+var(--safe-t))]">…</div>
```

iOS 26 and later also blur a band below the status bar that is taller than the reported inset, and may report no bottom inset. So add fixed extra space in the installed app only, with `@media (display-mode: standalone)` plus a `.standalone` class set from `navigator.standalone` in the boot script: `--safe-t: calc(env(safe-area-inset-top, 0px) + var(--app-t))`, with `--app-t: 24px` and `--app-b: 24px` there.

For JS-positioned sprites, read the insets from a probe's computed padding (`padding: var(--safe-t) var(--safe-r) var(--safe-b) var(--safe-l)`). Keep that probe on the page and re-read it from a `ResizeObserver` (`box: "border-box"`), because iOS can resolve the insets after load without firing a resize. Test by overriding the `--safe-*` variables, because desktop browsers can't emulate them.

`@media not (a) and (b)` is invalid CSS, so avoid `not-sm:` once `sm` has two conditions; write the media query explicitly. Check 390×844, 844×390, 667×375, 820×1180, 1180×820, 768×1024 and 1440×900. A browser `deviceScaleFactor` below 1 changes `--ipx` and doubles every size, so test at 1 or 2.

### 1.5 Size Text-Bound Details in Glyph Pixels (0.125em)

**Impact: HIGH (borders, gaps and icons inside text match the text's own pixel)**

Both fonts draw 8 glyph pixels per em, so `0.125em` is one glyph pixel of the surrounding text. Use eighths of an em for borders, gaps, light squares and icons that live inside a line of text. They then scale with the text and stay whole.

**Incorrect (a 2px border next to 3px glyph pixels looks thin and off-grid):**

```tsx
<span className="size-3 border-2 border-dark-red bg-red" />
```

**Correct:**

```tsx
<div className="flex items-center gap-[0.25em] px-[0.5em] py-[0.375em] text-body">
  <span className="size-[0.625em] border-[0.125em] border-dark-red bg-red" />
  <span className="ml-[0.25em] uppercase tracking-[0.125em]">{title}</span>
</div>
```

Pixel icons are drawn as string rows and rendered at `1em = 8` glyph pixels, so a 7×7 icon is 7 glyph pixels square. Line heights are eighths too: 1, 1.125, 1.25, 1.375, 1.625.

### 1.6 Draw Sprites as Whole Device-Pixel Blocks

**Impact: CRITICAL (prevents uneven art pixels (some 2px, some 3px) and smoothing blur)**

Draw each art pixel on a canvas as a block of `round(scale * dpr)` device pixels, size the backing store in device pixels, and set the CSS size to that divided by `dpr`. Turn smoothing off. Never scale a small `<img>` with CSS alone.

**Incorrect (CSS scaling at 1.25× gives rows of mixed widths):**

```tsx
<img src="/player.png" style={{ width: 8 * 4.3, imageRendering: "pixelated" }} />
```

**Correct:**

```ts
const resize = () => {
  const dpr = window.devicePixelRatio || 1;
  blockSize = Math.max(1, Math.round(scale * dpr));
  canvas.width = w * blockSize;
  canvas.height = h * blockSize;
  canvas.style.width = `${canvas.width / dpr}px`;
  canvas.style.height = `${canvas.height / dpr}px`;
};
const draw = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  if (flip) { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
  ctx.drawImage(img, frame * w, 0, w, h, 0, 0, w * blockSize, h * blockSize);
};
```

Pick `scale` from `artPx()` times a whole number (lane scale 4/5/6 on desktop, 4 on phones), or from a text's glyph pixel when a character stands on lettering (`fontSize / 8`). Snap anything you position from JS with `devicePx()`.

### 1.7 Hand-Draw UI Art as String Rows Rendered to SVG

**Impact: MEDIUM (crisp, recolourable, token-driven art without image files)**

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

---

## 2. Colour

**Impact: CRITICAL**

Only the 32 PICO-8 colours, flat, with no blending at rest. Themes swap three roles.

### 2.1 Use Only the 32 PICO-8 Colours

**Impact: CRITICAL (one off-palette colour breaks the look; switching the defaults off makes it impossible)**

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

### 2.2 No Opacity, Alpha or Gradients at Rest

**Impact: CRITICAL (blended colours fall outside the palette)**

Nothing that has settled may blend. Muted text is a muted palette colour: light-grey on dark grounds, dark-grey on light cards. Motion in progress (reveal fades, particles fading out) may cross-fade, as long as the settled result is pure palette.

**Incorrect:**

```tsx
<p className="text-white/60">Caption</p>
<div className="bg-black/50" />
<div style={{ background: "linear-gradient(#1d2b53, #111d35)" }} />
```

**Correct:**

```tsx
<p className="text-light-grey">Caption</p>          {/* on dark */}
<p className="type-body-sm text-dark-grey">Note</p>  {/* on a cream card */}
```

The one allowed gradient is a hard-stop pattern that draws pixels (the section teeth: `linear-gradient(90deg, var(--paper) 50%, transparent 0)`), which never blends.

### 2.3 Flat Colour, No Coloured Shading, Details Welcome

**Impact: HIGH (keeps UI in the same flat style as the character art)**

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

### 2.4 Themes Swap Three Roles, Applied Before Paint

**Impact: HIGH (consistent themes with no flash of the default palette)**

A theme sets three variables: a muted background, a second background, and one punchy accent. Backgrounds must be colours no sprite uses, so characters never blend in. Each theme's accent is unique, and neighbouring sections never share a background. Pure black is never a background, because black shadows would vanish on it. Themes reference tokens rather than redefining colours, and a saved theme is applied by an inline script before first paint.

**Incorrect (hex copies of the palette, black ground, applied after hydration):**

```ts
{ id: "night", bg: "#000000", bg2: "#111d35", accent: "#29adff" }
useEffect(() => applyPalette(saved), []);
```

**Correct:**

```ts
export const PALETTES = [
  { id: "shootemup", name: "Shoot'em", bg: pico("dark-blue"),     bg2: pico("darker-blue"),   accent: pico("red") },
  { id: "moss",      name: "Moss",     bg: pico("darkest-brown"), bg2: pico("darker-grey"),   accent: pico("dark-green") },
  { id: "midnight",  name: "Midnight", bg: pico("darker-blue"),   bg2: pico("dark-blue"),     accent: pico("blue") },
  { id: "slate",     name: "Slate",    bg: pico("darker-grey"),   bg2: pico("blue-green"),    accent: pico("dark-orange") },
  { id: "synth",     name: "Synth",    bg: pico("darker-blue"),   bg2: pico("darker-purple"), accent: pico("pink") },
];

export function applyPalette(p: Palette) {
  const s = document.documentElement.style;
  s.setProperty("--pico-bg", p.bg);
  s.setProperty("--pico-bg2", p.bg2);
  s.setProperty("--pico-accent", p.accent);
}

// Inlined in <body> so a saved palette applies before first paint.
export const paletteBootScript = `try{var p=localStorage.getItem("pico-palette");var k=${JSON.stringify(
  Object.fromEntries(PALETTES.map((p) => [p.id, [p.bg, p.bg2, p.accent]])),
)}[p];if(k){var s=document.documentElement.style;s.setProperty("--pico-bg",k[0]);s.setProperty("--pico-bg2",k[1]);s.setProperty("--pico-accent",k[2])}}catch(e){}`;
```

```css
.tone-dark  { --paper: var(--pico-bg);  --ink: var(--color-white); }
.tone-alt   { --paper: var(--pico-bg2); --ink: var(--color-white); }
.tone-light { --paper: var(--color-white); --ink: var(--color-black); }
.card-cream  { background-color: var(--color-white); color: var(--color-black); }
.card-accent { background-color: var(--pico-accent); color: var(--color-white); }
```

A palette swatch is just its three colours side by side, with no outline and no separators. On an accent hover row it takes a white outline so its accent chip stays visible.

---

## 3. Shadows and Layers

**Impact: CRITICAL**

Black, down and right, drawn as solid same-shape copies on a ground layer that sits under projectiles. Most visual bugs in this system are stacking-context bugs.

### 3.1 Draw Every Shadow in Title Pixels (--s)

**Impact: CRITICAL (one consistent shadow weight across the whole page)**

All shadows are black, fall down and to the right, and are measured in `--s`, the glyph pixel of headline-md, whatever the element's own pixel size. Small text, big cards and buttons all cast the same weight of shadow.

There are two exceptions, both relative to the element's own pixel:

- Lettering bigger than a title (a hero name) casts 1 of its own glyph pixels, so its shadow stays in proportion.
- A pressable's hover lift is 1 of its own text pixels (see `press-float-raise`).

**Incorrect (shadows follow each element's size, so they differ everywhere):**

```css
.card { box-shadow: 0.5rem 0.5rem 0 black; }
.small-chip { box-shadow: 2px 2px 0 black; }
```

**Correct:**

```css
:root {
  --s: var(--fp-headline-md); /* the shadow pixel */
  --px: var(--fp-body-md);    /* the element's own pixel, text by default */
}
```

```tsx
{/* Display-size hero: its own glyph pixel */}
<h1 className="relative type-display-md [--s:0.125em]">…</h1>
```

### 3.2 Shadows Are Solid Same-Shape Copies, Never Bands

**Impact: CRITICAL (prevents the background showing between an element and its shadow as it moves)**

A shadow is a black copy of the element's whole shape behind it, offset down and right. It is never an L-shaped band or border along the edges: when the element lifts or tilts, a band leaves a gap where the background shows through.

- **Resting elements** (static cards that neither float nor respond to the pointer): like titles, a same-size copy extended 1 `--s` right and down, so one shadow pixel runs the whole right and bottom edge, corner to corner.
- **Floating elements** (menus, panels, image frames): a copy grown 1 `--s` right and down and resting 1 `--s` right and down, so 2 shadow pixels show and the right and bottom edges are covered all the way along.
- **Titles**: 1 `--s` (see `shadow-title-drop-copy`).
- **Pressables**: an exact-size copy, 1 `--s` down (see `press-float-raise`).

**Incorrect (a band: lift the card and the background appears in the corner):**

```css
.card { border-right: 6px solid black; border-bottom: 6px solid black; }
.card { box-shadow: 6px 6px 0 black; } /* moves with the card; can't stay on the ground */
```

**Correct (a sibling element, so the face's corner clip never clips it):**

```css
.pixel-shadow {
  position: absolute;
  z-index: -1;
  background-color: var(--color-black);
  clip-path: var(--cut); /* the same stair-stepped shape, see surface-cut-corners */
  pointer-events: none;
}
.pixel-float > .pixel-shadow {
  inset: var(--s) calc(var(--s) * -2) calc(var(--s) * -2) var(--s);
}
.pixel-flat > .pixel-shadow {
  inset: 0 calc(var(--s) * -1) calc(var(--s) * -1) 0;
}
```

```tsx
<div className="pixel-flat pixel-cut">
  <PixelShadow />
  <div className="pixel-face card-cream p-4">…</div>
</div>
```

The shadow never moves: pressables and floating frames move only their face (see `press-float-raise`, `shadow-wrap-to-animate`).

### 3.3 Keep Shadows on a Ground Layer With No Stacking Contexts Above

**Impact: CRITICAL (prevents shadows jumping above bullets or painting over their own element)**

Shadows are `z-index: -1` elements (`.pixel-shadow` siblings, or the `::before` of an unclipped wrapper). For them to land below projectiles and above the section background, the section paints its background on its own `::before` at `-1`, and neither the shadowed element nor any ancestor may form a stacking context. `transform`, `opacity < 1`, `filter`, `position: sticky`, `container-type`, `will-change`, `isolation` or `z-index` on a positioned element all trap the shadow inside. A face's `clip-path` also forms a stacking context, which is why the shadow is the face's sibling, never its child.

Layers, bottom to top:

1. Section backgrounds.
2. Ground: shadows, bullet shadows, bullets (z −1, painted in DOM order).
3. Content: cards, text, frames.
4. Side-lane characters, sparks, muzzle flashes (z 40).
5. Fixed menus.

**Incorrect (the reveal keeps a transform, so every shadow inside paints over the card):**

```css
[data-reveal] { animation: reveal 600ms ease-out forwards; } /* forwards keeps transform */
.sidebar { position: sticky; top: 1rem; } /* sticky + shadowed = black block */
```

**Correct:**

```css
.section-paper { background-color: transparent; }
.section-paper::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: var(--paper);
  pointer-events: none;
}
/* Filling backwards only drops the effect once in, so no stacking context remains. */
[data-reveal] {
  animation: reveal ease-out backwards;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

```tsx
{/* Sticky goes on a wrapper, never on the shadowed card. */}
<div className="sticky top-4 self-start"><aside className="card-cream pixel-float">…</aside></div>
```

Big black blocks over content, or a shadow drawn on top of its own element, always mean a stacking context in the wrong place. Walk the ancestors with `getComputedStyle` and look for `transform`, `opacity`, `position`, `zIndex`, `containerType` or `filter`.

### 3.4 Never Animate a Shadowed Element, Animate a Wrapper

**Impact: CRITICAL (animating the element makes it a stacking context that lifts its own shadow)**

A shadowed element must never transform or animate itself. Put the reveal, bob or tilt on a wrapper, or split the element into separate shadow and body elements. Pressables are already split: only the face translates, and its sibling shadow stays on the ground (see `press-float-raise`).

**Incorrect (the card is both revealed and shadowed):**

```tsx
<li data-reveal className="card-cream pixel-float">…</li>
```

**Correct:**

```tsx
<li data-reveal>
  <div className="card-cream pixel-float">…</div>
</li>
```

A floating frame uses two siblings instead of a pseudo: the shadow tilts along with the body but never bobs, so it reads as the ground.

```tsx
<figure data-reveal className="relative" style={{ "--tilt": `${tilt}deg`, "--float-delay": `${delay}s` }}>
  <div aria-hidden="true" className="float-shadow" />
  <div className="float-body bg-cream">{children}</div>
</figure>
```

```css
.float-shadow { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.float-shadow::before { /* same grown black copy as .pixel-float::before */ }
/* Starts upright, leans to --tilt, back through upright to -tilt: a sine-like sway. */
@keyframes float-tilt {
  0%, 50% { rotate: 0deg; animation-timing-function: ease-out; }
  25% { rotate: var(--tilt, 1deg); animation-timing-function: ease-in; }
  75% { rotate: calc(var(--tilt, 1deg) * -1); animation-timing-function: ease-in; }
  100% { rotate: 0deg; }
}
@keyframes float-bob { to { translate: 0 calc(var(--px) * -2); } }
@media (prefers-reduced-motion: no-preference) {
  .float-shadow { animation: float-tilt 10s var(--float-delay, 0s) infinite; }
  .float-body {
    animation:
      float-tilt 10s var(--float-delay, 0s) infinite,
      float-bob 2s ease-in-out var(--float-delay, 0s) infinite alternate;
  }
}
```

The tilting body forms its own stacking context, which is fine because its shadow is a sibling, not a child.

### 3.5 Title Shadows Are a Black Text Copy on the Ground

**Impact: HIGH (solid glyph shadows that bullets fly between, including accent rings)**

Don't use `text-shadow` on the visible text: it paints above the ground layer, so bullets would pass under it. Render an `aria-hidden` black copy of the text, absolutely positioned at `z-index: -1`, with three `text-shadow`s (right, down, diagonal) of 1 `--s`. That makes a solid shadow along the whole right and bottom edge of each glyph.

**Incorrect:**

```css
h2 { text-shadow: 3px 3px 0 black; }
```

**Correct:**

```tsx
export function DropText({ children }: { children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="drop-copy">{children}</span>
      {children}
    </>
  );
}
<h2 className="relative type-headline-md"><DropText>Level <Mark>clear</Mark></DropText></h2>
```

```css
.drop-copy {
  position: absolute;
  inset: 0;
  z-index: -1;
  color: var(--color-black);
  text-shadow:
    var(--s) 0 var(--color-black),
    0 var(--s) var(--color-black),
    var(--s) var(--s) var(--color-black);
  pointer-events: none;
  user-select: none;
}
```

A marked key word (`.text-mark`) gets a 1-glyph-pixel accent ring from 8 `text-shadow`s at ±`0.125em`. Its copy inside `.drop-copy` redraws the ring's 9 positions in black, plus the same 9 shifted by `--s` right, down and diagonally, so the ring is shadowed too. The full list is in `templates/globals.css`. Collisions must skip `.drop-copy` text.

### 3.6 Characters and Bullets Use Only Top-Down Ground Shadows

**Impact: HIGH (keeps game objects in the game's perspective, not the UI's)**

UI shadows fall down and right. Characters and bullets live in a top-down game view, so they cast only the ground shadow drawn in their sprite art (a flat ellipse under the feet, one under the gun). Never give a sprite a UI drop shadow or outline. A character standing on something (a player on a letter of the hero name) has no shadow at all.

A bullet's shadow is a black copy on the floor, `floor` art rows below it: from the muzzle row down to the shadow row. With no ground shadow, the floor is the character's feet, one row lower.

**Incorrect:**

```tsx
<PixelSprite sheet={idle} style={{ filter: "drop-shadow(3px 3px 0 black)" }} />
```

**Correct:**

```css
.pixel-bullet {
  background: var(--color-white);
  box-shadow: 0 calc(var(--px) * var(--floor, 5)) var(--color-black);
}
```

```tsx
// Standing on something (no ground shadow), the floor is its feet.
<Bullets bullets={bullets} scale={scale} flipX={flipX} floor={shadow ? 5 : 6} />
```

In a free-flying game layer, render bullet shadows as separate elements in a lower fixed layer: `top: y + floor * scale`, with `floor = FLOOR_ROW - muzzleRow`.

---

## 4. Typography

**Impact: HIGH**

Two 8-pixel fonts, fifteen styles, each with a glyph pixel of whole device pixels.

### 4.1 Font Size Is Always 8 Whole Glyph Pixels

**Impact: CRITICAL (crisp pixel fonts at every size; no half-pixel strokes)**

Use two 8-pixel-em bitmap fonts: **Press Start 2P** (display, headline, title) and **Tiny5** (body, label). Every text style has a glyph-pixel token `--fp-<style>-<size>` made of whole device pixels, and its font size is 8 times that. Switch weights off (a synthetic bold smears pixels), disable font smoothing, and use one style per text element.

**Incorrect:**

```css
p { font-size: 15px; font-weight: 700; }
```

**Correct:**

```tsx
import { Press_Start_2P, Tiny5 } from "next/font/google";
const display = Press_Start_2P({ variable: "--font-display", weight: "400", subsets: ["latin"] });
const body = Tiny5({ variable: "--font-body", weight: "400", subsets: ["latin"] });
```

```css
@theme inline {
  --font-*: initial;
  --font-sans: var(--font-body);
  --font-pixel: var(--font-display);
  --font-weight-*: initial;
  --text-*: initial;
  --text-body: calc(var(--fp-body-md) * 8);
  --text-body-lg: calc(var(--fp-body-lg) * 8);
}
body {
  -webkit-font-smoothing: none;
  font-smooth: never;
}
```

Reading text never goes below 2 device pixels per glyph pixel (16px). Only label-sm, for tiny tags, drops to 1.

### 4.2 Fifteen Text Styles: Five Roles × lg, md, sm

**Impact: HIGH (one vocabulary for all text; each class sets font, size, line, case and tracking)**

Glyph pixels are in device pixels, phone / 40rem up (display: / 64rem up). Font size = 8 × value.

| Role     | Font        | Case                   | Line  | lg          | md                              | sm         |
| -------- | ----------- | ---------------------- | ----- | ----------- | ------------------------------- | ---------- |
| display  | Press Start | upper                  | 1     | 7 / 11 / 14 | round(clamp(4.5px, 1vw, 11px))  | 5 / 7 / 10 |
| headline | Press Start | upper                  | 1.125 | 5 / 8       | clamp(3, min(0.475vw, 0.75svh), 7) | 3 / 5   |
| title    | Press Start | as written             | 1.375 | 3 / 4       | 2 / 3                           | 2 / 2      |
| body     | Tiny5       | as written             | 1.375 | 3 / 4       | 2 / 3                           | 2 / 2      |
| label    | Tiny5       | upper, 0.25em tracking | 1     | 3 / 4       | 2 / 3                           | 1 / 1      |

**Incorrect (sizes and fonts scattered across components):**

```tsx
<h2 className="font-pixel text-3xl uppercase leading-tight">…</h2>
```

**Correct (one utility per style; tokens change per breakpoint):**

```css
:root {
  --fp-display-lg: calc(var(--ipx) * 7);
  --fp-display-md: round(clamp(4.5px, 1vw, 11px), var(--ipx));
  --fp-headline-md: round(
    clamp(calc(var(--ipx) * 3), min(0.475vw, 0.75svh), calc(var(--ipx) * 7)),
    var(--ipx)
  );
  --fp-body-md: calc(var(--ipx) * 2);
  --fp-label-sm: calc(var(--ipx) * 1);
  /* …all 15 */
}
@media (width >= 40rem) { :root { --fp-body-md: calc(var(--ipx) * 3); /* … */ } }
@media (width >= 64rem) { :root { --fp-display-lg: calc(var(--ipx) * 14); /* … */ } }

@utility type-headline-md {
  font-family: var(--font-display);
  font-size: calc(var(--fp-headline-md) * 8);
  line-height: 1.125;
  text-transform: uppercase;
}
@utility type-label-md {
  font-family: var(--font-body);
  font-size: calc(var(--fp-label-md) * 8);
  line-height: 1;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}
```

```tsx
<h2 className="relative type-headline-md text-balance"><DropText>…</DropText></h2>
```

Where a component needs its own line height or tracking (buttons, menu rows), use the size-only `text-body` / `text-body-lg` with `leading-none tracking-[0.125em] uppercase`.

### 4.3 Press Start Only for Display and Headlines

**Impact: HIGH (keeps the heavy display font special and reading text legible)**

Press Start 2P is wide and heavy. Use it only for the one display line (a hero name) and section headlines. Everything else, including card titles, buttons, prompts, labels and footnotes, is Tiny5.

| Use                                    | Style                                                  |
| -------------------------------------- | ------------------------------------------------------ |
| Hero name                              | display-md, with its own-pixel shadow                  |
| Section titles                         | headline-md                                            |
| Card titles, subtitles, prompts        | body-lg (prompts and subtitles uppercase, 0.125–0.25em tracking) |
| Reading text                           | body-md                                                |
| Card footnotes                         | body-sm, muted colour                                  |
| Buttons                                | body-md on phones, body-lg from 40rem, uppercase, 0.125em |
| Section and category labels, copyright | label-md, light-grey                                   |
| Tiny tags only                         | label-sm (8px; too small for anything people read)    |

**Incorrect:**

```tsx
<h3 className="type-title-lg">Project name</h3>
<small className="type-label-sm">© 2026</small>
```

**Correct:**

```tsx
<h3 className="type-body-lg">Project name</h3>
<p className="type-label-md text-light-grey">© 2026</p>
```

When moving an existing UI onto the system, match its current rendered sizes first (measure font sizes at 390, 800 and 1440px wide), then pick the closest whole-pixel token.

### 4.4 Line Heights in Eighths, Tracking in Whole Glyph Pixels

**Impact: MEDIUM (line boxes and letter gaps land on whole pixels)**

With an 8-pixel em, line heights of 1, 1.125, 1.25, 1.375 or 1.625 give whole-pixel line boxes. Letter spacing is 0.125em or 0.25em (1 or 2 glyph pixels). Headline-md at 1.125 leaves exactly one glyph pixel between lines, room for the 1-pixel shadow. Marked words with a ring use `leading-snug` (1.375) to make room for the ring and its shadow.

**Incorrect:**

```tsx
<p className="leading-[1.4] tracking-[0.05em]">…</p>
```

**Correct:**

```tsx
<p className="type-body-md">…</p>                           {/* 1.375 */}
<span className="uppercase tracking-[0.125em] leading-none">Start</span>
<span className="text-mark leading-snug">clear</span>
```

---

## 5. Pressables and Motion

**Impact: HIGH**

Button faces float, lift one of their own pixels on hover and sit flush when pressed, while the host stays still as the hit zone. Floating frames, reveals and feedback.

### 5.1 Pressables Float, Lift One Own Pixel, Press Flush

**Impact: HIGH (tactile buttons whose shadow never moves or shows the background)**

Buttons, header buttons and link cards float 1 `--s` above a black copy of exactly their shape.

- **At rest,** 1 shadow pixel shows.
- **On hover,** the face rises 1 of its own text pixels (`0.125em`), so small controls don't jump.
- **When pressed,** it sinks flush onto the floor, covering the shadow completely.

Only the face moves. The host holds a sibling shadow and the face (see `surface-cut-corners`), so moving the face with `translate` leaves the shadow on the ground, and the compositor animates it without layout or paint. Never animate offsets (`top`/`left`) or a registered custom property: both relayout or repaint every frame.

**Incorrect (moves the whole element, shadow included; offsets relayout every frame; scale leaves half pixels):**

```css
.btn:hover  { transform: translate(-2px, -2px); box-shadow: 4px 4px 0 black; }
.btn:hover  { top: -2px; left: -2px; }
.btn:active { transform: scale(0.97); }
```

**Correct:**

```css
.pixel-button { position: relative; pointer-events: auto; }
.pixel-button > .pixel-shadow {
  inset: var(--s) calc(var(--s) * -1) calc(var(--s) * -1) var(--s); /* exact size, 1 --s down */
}
.pixel-button > .pixel-face {
  transition: translate 100ms var(--ease-out);
  pointer-events: none;
}
@media (hover: hover) {
  .pixel-button:hover > .pixel-face { translate: -0.125em -0.125em; }
}
.pixel-button:active > .pixel-face { translate: var(--s) var(--s); }
```

```tsx
<a href={href} className="pixel-button pixel-cut inline-flex">
  <PixelShadow />
  <span className="pixel-face card-accent inline-flex items-center gap-3 px-6 py-4 uppercase">
    {children}
  </span>
</a>
```

Gate hover behind `(hover: hover)` so a tap on a phone doesn't leave the button stuck in its lifted state. Hover colours on the face use `group-hover:` from the host.

### 5.2 The Hit Zone Never Moves

**Impact: HIGH (stops hover flicker when the cursor sits on a moving button's edge)**

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

### 5.3 Menu Rows Highlight in Accent; Selected Looks Like Hovered

**Impact: MEDIUM (one clear selection state in menus, with no outlines or tints)**

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

### 5.4 Image Frames Start Upright, Then Bob and Sway; Their Shadow Only Sways

**Impact: MEDIUM (lively frames whose shadow reads as the ground)**

Image frames and their pictures float. Every frame starts upright, with no rotation at all, then bobs up to 2 of its pixels and sways ±1°. The sign of `tilt` picks which way it leans first. Give neighbours different positive delays so they drift out of phase; a positive delay keeps each frame upright until it starts, which a negative delay wouldn't. The shadow shares the tilt keyframes but not the bob. With reduced motion on, frames sit still and upright. The implementation is in `shadow-wrap-to-animate`.

**Incorrect (the whole figure bobs, shadow included, so it floats with no ground):**

```css
figure { animation: bob 2s infinite alternate; filter: drop-shadow(6px 6px 0 black); }
```

**Correct:**

```tsx
<WindowFrame title="Game" tilt={-1}>…</WindowFrame>
<ConsoleFrame title="P1" tilt={1} delay={1.5}>…</ConsoleFrame>
```

Collisions use the frame's bounding rect, tilt included (see `combat-covers-not-shadows`).

### 5.5 Reveals, Hurt Flashes and Reduced Motion

**Impact: MEDIUM (smooth motion that stays pure palette and respects user settings)**

- **Scroll reveals** are CSS view timelines, which run on the compositor and stay smooth on iOS. Fill `backwards` only (see `shadow-ground-layer`).
- **Hurt feedback** is a solid palette flash, the way PICO-8 swaps palettes: the whole sprite goes solid red twice, 70ms on and 70ms off, starting at 0 and 140ms. No transparency.
- **Blinking prompts** use `steps(1)`, so they switch on and off with no fade.
- **Reduced motion** turns off bobbing, particles, bullets and slide-ins.

**Incorrect:**

```tsx
<div style={{ opacity: hurt ? 0.5 : 1, filter: hurt ? "sepia(1) hue-rotate(-50deg)" : "none" }}>
```

**Correct:**

```ts
// Inside the sprite draw: a solid palette colour over the drawn pixels only.
if (tint) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = tint; // "#ff004d"
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
}

const flashHurt = (flashes: number[]) => {
  timers.forEach(clearTimeout);
  setHurt(false);
  timers = flashes.flatMap((at) => [
    setTimeout(() => setHurt(true), at),
    setTimeout(() => setHurt(false), at + 70),
  ]);
};
flashHurt([0, 140]);

// Hand only: swap one exact colour.
function recolour(ctx: CanvasRenderingContext2D, from: string, to: string) {
  const image = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const d = image.data;
  const [r, g, b] = rgb(from);
  const [nr, ng, nb] = rgb(to);
  for (let i = 0; i < d.length; i += 4)
    if (d[i + 3] >= 128 && d[i] === r && d[i + 1] === g && d[i + 2] === b) {
      d[i] = nr; d[i + 1] = ng; d[i + 2] = nb;
    }
  ctx.putImageData(image, 0, 0);
}
```

```css
@keyframes reveal {
  from { opacity: 0; transform: translate3d(0, calc(var(--p) * 8), 0); }
}
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-reveal] {
      animation: reveal ease-out backwards;
      animation-timeline: view();
      animation-range: entry 0% entry 100%;
    }
  }
}
.blink { animation: blink 1.1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
```

Tint the body whole. On a held item, tint only the hand: swap that one colour, the way PICO-8 palette swaps work. Never tint the metal or the ground shadows. A redraw on tint change must not restart the frame clock: keep tint in a ref and call a stored `redraw()`.

### 5.6 Declare Click Sounds With data-sound, One Listener

**Impact: MEDIUM (server components click too; no per-component audio code)**

Every pressable plays a sound. Elements declare which one with `data-sound`, and one delegated document listener plays it, so server-rendered links need no client code. Audio is off by default and remembered. Files load only once sound is on, and the context starts inside a user gesture.

**Incorrect:**

```tsx
"use client";
<a href="/cv.pdf" onClick={() => playSound("ui")}>CV</a>
```

**Correct:**

```tsx
<a href="/cv.pdf" download="Joan_Hervas_CV.pdf" data-sound="confirm" className={buttonClasses}>CV</a>
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

UI sounds never vary in pitch: one fixed pitch for opening (menus, toggles) and a higher one for confirming (buttons, links, menu choices), with `jitter: 0`:

```ts
open: { file: "MenuSelect", level: -38, jitter: 0 },
confirm: { file: "MenuSelect", level: -38, rate: 1.3, jitter: 0 },
```

Normalise every file to its measured loudness (`gain = 10 ** ((level - LOUDNESS[file]) / 20)`), keep levels subtle (around −40 dB), and jitter only game sounds' playback rate (±6%) so repeated shots don't drone. Pitch enemy shots higher than the player's (rate 1.6 against 0.85).

---

## 6. Outlines and Surfaces

**Impact: MEDIUM-HIGH**

No black outlines; contrast from flat colour, spacing and shadow. Stair-stepped corners, a short list of allowed exceptions and the two image frames.

### 6.1 Surfaces Have Stair-Stepped Corners

**Impact: MEDIUM-HIGH (pixel-art corners on every button, card, chip, frame and menu, with shadows that match)**

Buttons, cards, chips, image frames and menu panels lose a stair of `--s` squares from each corner, like a pixel-art rounded rectangle. They get one step per 12 `--s` of their shorter side, with a minimum of 1, so small controls get one notch and big windows get several. Never use `border-radius`: it anti-aliases, and it can't be drawn in whole pixels.

- Cut with `clip-path: var(--cut)`. `--cut` is a polygon in `var(--s)` and `%` terms, so it follows the element's size and stays on the pixel grid.
- `clip-path` also clips the element's own pseudo-elements, so a shadowed surface splits in two:
  - the **host** (`.pixel-cut` plus `.pixel-float`, `.pixel-flat` or `.pixel-button`) carries position, sizing and the pointer;
  - it holds a **sibling shadow** (`.pixel-shadow`, see `shadow-solid-copy`) and a **face** (`.pixel-face`, clipped) that carries fill, padding and text.
- Unshadowed surfaces (chips, badges) put `pixel-cut pixel-face` on one element.
- The shadow uses the same `--cut`: its `%` terms resolve against its own box, so the stairs line up with the face.
- `PixelCorners` (mounted once in the root layout) sets `--cut` on every `.pixel-cut` from its size with a shared `ResizeObserver`. It reads every size first, then writes only the changed values, so it never forces a layout. Elements that mount later, like menu panels, take `ref={pixelCutRef}`. The CSS default is one step, which shows until hydration.

**Incorrect (border-radius blurs the corner; clipping the host also clips its `::before` shadow):**

```css
.card { border-radius: 8px; }
.card { clip-path: var(--cut); } /* the shadow pseudo disappears with the corner */
```

**Correct:**

```css
.pixel-cut {
  --cut: polygon(0 var(--s), var(--s) var(--s), var(--s) 0, /* … one step, clockwise … */);
}
.pixel-face {
  position: relative;
  clip-path: var(--cut);
}
```

```tsx
<div className="pixel-flat pixel-cut">
  <PixelShadow />
  <div className="pixel-face card-cream p-4">…</div>
</div>
<li className="pixel-cut pixel-face card-accent px-3 py-2">React</li>
```

Class names that other code looks up (the collision covers `.card-cream`, `.card-accent`, `.float-body`) belong on the face, the part you can see.

### 6.2 No Black Outlines, With a Short List of Exceptions

**Impact: HIGH (separation comes from flat colour, spacing and shadow, not strokes)**

Black is for shadows and for solid shapes (a D-pad, text), not for borders, strokes or rings. Avoid coloured outlines too. The allowed exceptions:

- the accent ring around marked title words, which is part of the lettering;
- the keyboard focus ring: accent colour, 1 P wide, offset 1 P;
- a 1-glyph-pixel outline on small colour samples that need contrast:
  - lights take a darker shade of their own hue: red in dark-red, yellow in orange, green in medium-green;
- a palette swatch on a hovered menu row takes a 1-glyph-pixel white outline, because its accent chip would merge with the accent row. At rest it has no outline or separators;
- a muted inner divider where two same-coloured surfaces meet, such as a light-grey line under a menu's cream title bar. There is no divider where the bar sits on a picture.

**Incorrect:**

```tsx
<div className="border-2 border-black bg-cream">…</div>
<span className="size-[0.625em] border-[0.125em] border-black bg-yellow" />
```

**Correct:**

```tsx
const LIGHTS = ["bg-red border-dark-red", "bg-yellow border-orange", "bg-green border-medium-green"];
<span className={`size-[0.625em] border-[0.125em] ${light}`} />

{/* A palette swatch: three flat chips side by side; white outline only on the accent hover row. */}
<button className={`group ${dropdown.item}`}>
  <PixelArt
    rows={Array.from({ length: 6 }, () => "bbbbbbggggggaaaaaa")}
    colors={{ b: p.bg, g: p.bg2, a: p.accent }}
    className="w-[2.25em] outline-cream group-hover:outline-solid group-hover:outline-[0.125em]"
  />
  {p.name}
</button>
```

```css
:focus-visible { outline: var(--p) solid var(--pico-accent); outline-offset: var(--p); }
```

### 6.3 Two Image Frames: Window and Console

**Impact: MEDIUM (pictures framed without borders, in the system's own vocabulary)**

- **Window frame:** a cream title bar with three flat lights, each outlined in its own darker hue, and an uppercase title. The image sits directly below with no divider or border; the image itself gives the contrast. Menus use the same bar with a light-grey divider, because their list below is also cream.
- **Console frame:** a cream body, a black D-pad with a dark-grey highlight rim and pivot, a dark-grey bezel with a power light and label, a recessed screen, and two accent round buttons with white highlight pixels and a black drop pixel. Every art piece is drawn one art pixel per P.

**Incorrect:**

```tsx
<div className="rounded-lg border-4 border-black p-2"><img … /></div>
```

**Correct:**

```tsx
<FloatFrame tilt={-1} bodyClassName="bg-cream">
  <TitleBar title="Game" />
  <Image … />
</FloatFrame>

<FloatFrame tilt={1} bodyClassName="flex items-center justify-between gap-6 bg-cream px-6 py-8">
  <PixelArt rows={DPAD} colors={DPAD_COLORS} className="w-19 shrink-0" />
  <div className="min-w-0 flex-1 bg-dark-grey px-3 pb-3">
    <div className="flex items-center gap-[0.5em] py-[0.375em] text-body uppercase leading-none tracking-[0.125em] text-cream">
      <span className="size-[0.625em] border-[0.125em] border-dark-red bg-red" />
      P1
    </div>
    <div className="bg-black pl-(--p) pt-(--p)">{children}</div>
  </div>
  <div className="relative size-25 shrink-0">
    <PixelArt rows={ROUND_BUTTON} colors={BUTTON_COLORS} className="absolute bottom-0 left-0 w-14" />
    <PixelArt rows={ROUND_BUTTON} colors={BUTTON_COLORS} className="absolute right-0 top-0 w-14" />
  </div>
</FloatFrame>
```

Add depth only to parts that already exist (a highlight rim, a drop pixel, a recess). Don't add decorations like speaker grilles, pills or letters.

---

## 7. Sprites and Animation

**Impact: HIGH**

Canvas sprite sheets drawn in whole device-pixel blocks, layered body, gun and shadows, and momentum-matched idle and attack transitions.

### 7.1 Horizontal Strip Sheets With Typed Metadata

**Impact: HIGH (one renderer for every character; per-kind quirks live in data)**

Each animation is a PNG with frames laid out left to right: `src`, `frameWidth`, `frameHeight`, `frames`, `fps` (12 by default, like the source game). Keep a separate 1-frame sheet for each ground shadow. Put per-character facts in data (size, shadow size and first visible shadow row, muzzle row, fire frames, sink, transition frames), not in components.

**Incorrect (magic numbers inside components):**

```tsx
{kind === 3 && <div style={{ top: 4 }} />}
```

**Correct:**

```ts
export type SpriteSheet = { src: string; frameWidth: number; frameHeight: number; frames: number; fps?: number };

export type EnemyKind = {
  id: number;
  width: number; height: number;
  shadowWidth: number; shadowHeight: number;
  /** First visible row of the shadow art. */
  shadowTop: number;
  attackFrames: number;
  fireFrames: number[];      // attack frames that fire a bullet
  muzzleTop: number;         // art row the bullet leaves from
  sink?: number;             // rows the body sits lower (+) or higher (−) than its box
  flipX?: boolean;           // art drawn facing the wrong way
  attackFromIdle?: number;   // idle frame that best leads into attack frame 0
  idleAfterAttack?: number;  // idle frame that best follows the last attack frame
  attackStart?: number;      // leading attack frames skipped because they fight the idle motion
};

function sheet(kind: EnemyKind, animation: "idle" | "walk" | "hit" | "attack"): SpriteSheet {
  const base = `/imgs/Enemies/Enemy${kind.id}/Enemy${kind.id}`;
  const frame = { frameWidth: kind.width, frameHeight: kind.height };
  if (animation === "attack") return { src: `${base}-Attack.png`, ...frame, frames: kind.attackFrames, fps: 12 };
  if (animation === "hit") return { src: `${base}-Hit.png`, ...frame, frames: 2, fps: 12 };
  return { src: `${base}-${animation === "walk" ? "Walk" : "Idle"}.png`, ...frame, frames: 6, fps: 12 };
}
```

Export PNGs at 1× art size and let the renderer scale. Ship pixel art as lossless WebP or PNG, never lossy.

### 7.2 Compose Characters From Layered Sprites

**Impact: HIGH (correct depth order, facing and hit masks for multi-part characters)**

Stack each part as its own absolutely positioned canvas, bottom to top: gun shadow, body shadow, body, gun. Offsets are in art pixels times `scale`, with separate left and right values per facing. Flip with the canvas transform (`flipX`), not CSS `scaleX(-1)`, so the bitmap and its box stay in step. Only the body is the character: mark it `sprite-solid` (its hitbox) and tint only it. The gun is not hit, and only its hand pixels flash (`tintOnly`); the shadows do neither.

**Correct:**

```ts
const GUN = { left: -5, right: 7, top: 2 };
const GUN_SHADOW = { left: -6, right: 5, top: 9 };
// On the gun tip in its recoil frame, so the first moving frame looks flush.
export const MUZZLE = { left: -3, right: 10, top: 4 };
```

```tsx
const side = flipX ? "right" : "left";
<div className="relative" style={{ width: 8 * scale, height: (shadow ? 11 : 10) * scale, "--px": `${scale}px` }}>
  {shadow && weapon && (
    <PixelSprite sheet={shooting ? GUN_SHADOW_SHOOT : GUN_SHADOW_IDLE} loop={false} scale={scale} flipX={flipX}
      className="absolute" style={{ left: GUN_SHADOW[side] * scale, top: GUN_SHADOW.top * scale }} />
  )}
  {shadow && <PixelSprite sheet={SHADOW} scale={scale} className="absolute left-0" style={{ top: 9 * scale }} />}
  <PixelSprite sheet={BODY[animation]} scale={scale} flipX={flipX} tint={tint}
    className="sprite-solid absolute left-0 top-0" />
  {weapon && (
    <PixelSprite sheet={shooting ? GUN_SHOOT : GUN_IDLE} loop={false} scale={scale} flipX={flipX}
      tint={tint} tintOnly="#ffccaa" className="absolute" style={{ left: GUN[side] * scale, top: GUN.top * scale }} />
  )}
</div>
```

The gun shot animation and its shadow play once (`loop={false}`), in step with a 250ms recoil window. An enemy centres its shadow under the body (`left: (width - shadowWidth) / 2 * scale`, `bottom: 0`) and shifts the body by `sink` rows.

### 7.3 Align Every Character's Shadow to One Floor Row

**Impact: MEDIUM (player and enemies stand on the same ground despite different sprite sizes)**

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

### 7.4 Momentum-Match Idle and Attack Transitions

**Impact: HIGH (removes the visible jump when a looping idle cuts into an attack and back)**

Cutting from an arbitrary idle frame into attack frame 0 makes the character jump, because the idle bob is mid-motion. For each character, note:

- which idle frame best leads into the attack (`attackFromIdle`);
- which idle frame best follows the last attack frame (`idleAfterAttack`);
- which leading attack frames fight the idle motion and should be skipped (`attackStart`).

Then schedule the attack for the moment the idle loop reaches `attackFromIdle`, and resume idle from `idleAfterAttack` through `startFrame`.

**Incorrect (fixed interval, restart idle at frame 0):**

```ts
setInterval(() => setAnimation("attack"), 2000);
// …after attack: setAnimation("idle") -> idle restarts at frame 0, visible snap
```

**Correct:**

```ts
const IDLE_FRAMES = 6;
const IDLE_FRAME_MS = 1000 / 12;
const IDLE_CYCLES_PER_ATTACK = 3;

// Idle loops, then on to the idle frame closest to the attack's first frame.
function attackWait({ kind, idleFrom }: EnemyState) {
  const target = kind.attackFromIdle ?? 0;
  const frames =
    IDLE_CYCLES_PER_ATTACK * IDLE_FRAMES + ((target - idleFrom + IDLE_FRAMES) % IDLE_FRAMES);
  return frames * IDLE_FRAME_MS;
}

export function attackTiming(kind: EnemyKind) {
  const frameMs = 1000 / 12;
  const start = kind.attackStart ?? 0;
  return {
    duration: (kind.attackFrames - start) * frameMs,
    shots: kind.fireFrames.map((f) => (f - start) * frameMs),
  };
}

useEffect(() => {
  if (!attackReady) return; // visible, not walking, both alive, not already attacking
  const timer = setTimeout(() => {
    const { kind } = enemyRef.current;
    const { duration, shots } = attackTiming(kind);
    setEnemy((e) => ({ ...e, attacking: true }));
    setTimeout(() =>
      setEnemy((e) => (e.kind === kind ? { ...e, attacking: false, idleFrom: kind.idleAfterAttack ?? 0 } : e)),
      duration);
    for (const at of shots) setTimeout(() => shootBack(kind), at);
  }, attackWait(enemyRef.current));
  return () => clearTimeout(timer);
}, [attackReady]);
```

```tsx
<PixelSprite
  sheet={sheet(kind, animation)}
  loop={animation !== "attack"}
  startFrame={animation === "attack" ? (kind.attackStart ?? 0) : idleFrom}
/>
```

Each shot callback re-checks that the same kind is still alive, idle and not walking before firing, so a shot scheduled before a death or scroll never fires. Walking resets `idleFrom` to 0. Get it all working with a fixed-step sprite clock (`perf-fixed-step-clock`), because the timers and the frames must agree.

### 7.5 Spawn Shots Flush With the Muzzle on the Recoil Frame

**Impact: MEDIUM (flash and bullet read as leaving the gun, not floating beside it)**

Measure the muzzle on the gun's recoil frame (the frame shown when the bullet appears), in art pixels per facing. Place the bullet and a cone-shaped flash there. Enemy shots leave from the horizontal centre of the sprite at `muzzleTop`, snapped to whole pixels. Check the gap at phone scale too: one art pixel of gap at scale 4 is very visible.

**Incorrect (from the idle gun tip; a pixel gap shows once recoil pulls the gun back):**

```ts
const x = left + 11 * scale;
```

**Correct:**

```ts
export const MUZZLE = { left: -3, right: 10, top: 4 };
const x = playerLeft + MUZZLE.right * scale;
const y = trackY() + MUZZLE.top * scale;
addShot({ from: "player", x, y, floor: FLOOR_ROW - MUZZLE.top });
addSpark(x, y, flashPieces(1, FLASH_COLORS.player, id), "is-flash");

// Enemy
const x = Math.round(sprite.left + sprite.width / 2);
const y = Math.round(sprite.top + kind.muzzleTop * scale);
addSpark(x, y + scale / 2, flashPieces(-1, FLASH_COLORS.enemy, id), "is-flash");
```

```ts
export const FLASH_COLORS = {
  player: ["#fff1e8", "#ffec27", "#ffa300"],
  enemy: ["#ff004d", "#ffa300", "#fff1e8"],
} as const;
// Deterministic noise, so a flash looks the same on every render.
function noise(seed: number) { const x = Math.sin(seed * 12.9898) * 43758.5453; return x - Math.floor(x); }
export function flashPieces(dir: number, colors: readonly string[], seed: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const spread = i / 5 - 0.5 + (noise(seed + i) - 0.5) * 0.2;
    const angle = spread * (100 * Math.PI) / 180;
    const distance = 3 + noise(seed + i + 0.5) * 4;
    return { x: 0, y: 0, color: colors[i % colors.length], dx: dir * Math.cos(angle) * distance, dy: Math.sin(angle) * distance };
  });
}
```

Player bullets are 1 art pixel, white. Enemy bullets are 2 art pixels, red. The player's recoil (`useOneShot(250)`) blocks re-firing until it ends.

### 7.6 Burst From the Frame on Screen, Then Slide Back In

**Impact: MEDIUM (deaths never wait on a download and respawns never flash)**

On death, read the pixels of the canvas that is on screen right now, and turn each coloured art pixel into a particle flying outward from the centre with some random spread. Hide the sprite instantly (`is-snapped` switches its transition off), swap in the next character halfway through the burst, then slide it in on the second animation frame so the transition runs.

**Correct:**

```ts
function canvasPixels(canvas: HTMLCanvasElement | null, width: number, height: number) {
  const ctx = canvas?.width ? canvas.getContext("2d") : null;
  if (!canvas || !ctx) return [];
  const block = canvas.width / width;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pixels = [];
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const i = (Math.floor((y + 0.5) * block) * canvas.width + Math.floor((x + 0.5) * block)) * 4;
      if (data[i + 3] >= 128) pixels.push({ x, y, color: `rgb(${data[i]} ${data[i + 1]} ${data[i + 2]})` });
    }
  return pixels;
}

function burstPieces(pixels: Pixel[], width: number, height: number) {
  return pixels.map(({ x, y, color }) => {
    const angle = Math.atan2(y + 0.5 - height / 2, x + 0.5 - width / 2) + (Math.random() - 0.5) * 0.5;
    const distance = 4 + Math.random() * 8;
    return { x, y, color, dx: Math.round(Math.cos(angle) * distance), dy: Math.round(Math.sin(angle) * distance) };
  });
}

function slideInAfterBurst(respawn: () => void, show: () => void, after = 250) {
  setTimeout(() => {
    respawn();                                                  // phase "gone": off screen, no transition
    requestAnimationFrame(() => requestAnimationFrame(show));   // then "alive": slides in
  }, after);
}
```

```css
.enemy-drop { transition: transform 500ms var(--ease-soft), opacity 350ms ease-out; }
.enemy-drop.is-hidden { transform: translateX(160%); opacity: 0; }
.enemy-drop.is-snapped { opacity: 0; transition: none; }
.pixel-burst { animation: pixel-burst-move 500ms var(--ease-out) forwards, pixel-burst-fade 500ms ease-in forwards; }
```

Update the state ref synchronously (`enemyRef.current = next`) before `setState`, so two bullets arriving in the same frame can't both deal the killing hit.

---

## 8. Combat: Bullets, Collisions, Effects

**Impact: MEDIUM-HIGH**

Bullets move on CSS, collide with plain hitboxes of solid things (never shadows) and disappear on the first hit.

### 8.1 Bullets Move in the Game Loop, in Fixed Screen Layers

**Impact: MEDIUM (bullets never drawn past a hit, with correct depth under content and over characters)**

Move bullets from the same `requestAnimationFrame` loop that checks collisions: `x = spawnX + dir * speed * (now - born)`, snapped with `devicePx()` and written as a `translateX` on every copy. Don't use a CSS keyframe: it runs on the compositor thread and keeps moving bullets past covers whenever the main thread is late. Bullets are `position: fixed` at the screen height they were fired from, so scrolling dodges them. Render shadow copies in a `z-index: -1` layer and bullets in a `-1` layer after it (over characters, under content). On desktop, add a second bullet copy at z 40 clipped to the side lane, so bullets over the lane show above the lane character.

**Incorrect (compositor-driven; the collision loop can only chase it):**

```css
.shot { animation: pixel-bullet 1000ms linear both; }
```

**Correct:**

```ts
const speed = prefersReducedMotion() ? 0 : window.innerWidth / BULLET_MS;
const to = devicePx(shot.x + dir * speed * (now - shot.born));
// …hit test from last position to `to`, then:
function place(shot: Shot, x: number) {
  for (const el of document.querySelectorAll<HTMLElement>(`[data-shot="${shot.id}"]`))
    el.style.transform = `translateX(${x - shot.x}px)`;
}
```

```tsx
<div className="pointer-events-none fixed inset-0 z-[-1]">{shots.map((s) => renderShot(s, "shadow"))}</div>
{/* player and enemy tracks */}
<div className="pointer-events-none fixed inset-0 z-[-1]">{shots.map((s) => renderShot(s, "bullet"))}</div>
<div className="pointer-events-none fixed inset-0 z-40">{sparks}</div>
<div className="pointer-events-none fixed inset-0 z-40 [clip-path:inset(0_0_0_calc(100%-var(--lane)))]">
  {shots.map((s) => renderShot(s, "bullet"))}
</div>
```

Every copy carries `data-shot={id}` so one write moves them all.

### 8.2 Only Solid Things Stop Bullets, Never Shadows

**Impact: HIGH (bullets hit what reads as solid and fly over shadows)**

Bullets stop at cards and buttons, image frames, the text lines of titles (a marked word's accent ring included), and the body sprite of the target character (not its gun). Shadows, `.drop-copy` text and empty space never stop them. Use plain rectangles: `getBoundingClientRect()` for elements (a tilted frame's rect is close enough), and one `Range.getClientRects()` rect per line of title text. Read covers fresh each frame, only for what is on screen.

**Incorrect (the whole heading block, including the empty space beside short titles):**

```ts
document.querySelectorAll("h2").forEach((h) => covers.push(h.getBoundingClientRect()));
```

**Correct:**

```ts
const COVERS = "main .card-cream, main .card-accent, main .float-body";

function titleLines(title: Element, rects: Rect[]) {
  const range = document.createRange();
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || parent.closest(".drop-copy, button")) continue;
    // A marked word's accent ring is part of it; its shadow is not.
    const ring = parent.closest(".text-mark") ? Number.parseFloat(getComputedStyle(parent).fontSize) / 8 : 0;
    range.selectNodeContents(node);
    for (const r of range.getClientRects())
      if (onScreen(r)) rects.push({ left: r.left - ring, top: r.top - ring, right: r.right + ring, bottom: r.bottom + ring });
  }
}

export function spriteRects(track: HTMLElement | null): Rect[] {
  return [...(track?.querySelectorAll("canvas.sprite-solid") ?? [])].map((c) => c.getBoundingClientRect());
}
```

Only the body canvas carries `sprite-solid`; the gun and shadow canvases never collide.

### 8.3 Simple Swept Hitboxes; the Bullet Disappears on the First Hit

**Impact: HIGH (reliable, cheap collisions with no bullets passing through or lingering)**

Bullets move horizontally and covers move vertically as the page scrolls, so rectangles are enough. Each frame, sweep the bullet from its last x to its new x, and sweep each cover over the scroll distance `dy` since the last frame. Nothing then tunnels, whether it flew or scrolled past. The nearest box along the flight direction wins, cover or character. On a hit, draw the bullet flush at the contact point for that one frame, stop checking it, remove it on the next frame, and spark off cover.

**Incorrect (overlap at the current frame only; tunnels on fast shots or fast scrolls, and draws the bullet past the face):**

```ts
if (overlaps(bullet.getBoundingClientRect(), cover)) spark();
```

**Correct:**

```ts
export function firstHit(from: number, to: number, size: number, top: number, rects: Rect[], dy: number) {
  const dir = Math.sign(to - from) || 1;
  const left = Math.min(from, to);
  const right = Math.max(from, to) + size;
  let best: { x: number; vertical: boolean } | null = null;
  for (const r of rects) {
    if (r.right <= left || r.left >= right) continue;
    if (Math.max(r.bottom, r.bottom + dy) <= top) continue;
    if (Math.min(r.top, r.top + dy) >= top + size) continue;
    const inside = r.left < from + size && r.right > from;
    const x = inside ? from : dir > 0 ? r.left - size : r.right;
    if (!best || (x - best.x) * dir < 0) best = { x, vertical: inside };
  }
  return best;
}
```

```ts
const dy = window.scrollY - lastScrollY;
const struck = firstHit(from, to, size, shot.y, spriteRects(target), 0);
const cover = firstHit(from, to, size, shot.y, covers, dy);
if (struck && (!cover || (struck.x - cover.x) * dir <= 0) && damage(shot.id)) {
  place(shot, struck.x);
  land(shot.id); // live.delete(id); requestAnimationFrame(() => removeShot(id))
} else if (cover) {
  place(shot, cover.x);
  land(shot.id);
  addSpark(/* at the face */, sparkPieces(color, cover.vertical ? [0, dy > 0 ? -1 : 1] : [-dir, 0]));
} else {
  place(shot, to);
}
```

```ts
function sparkPieces(color: string, [nx, ny]: [number, number]) {
  return Array.from({ length: 6 }, (_, i) => {
    const along = 2 + Math.random() * 4;
    const across = (Math.random() - 0.5) * 8;
    return { x: 0, y: 0, color: i % 3 ? color : "#fff1e8", dx: Math.round(nx * along - ny * across), dy: Math.round(ny * along + nx * across) };
  });
}
```

A target that can't be hurt right now (dead, respawning, off screen) doesn't stop the bullet. Removing the element in the same frame as the hit would make React drop it before the flush frame paints, which is why removal waits one frame.

---

## 9. Performance

**Impact: MEDIUM**

Sleeping sprite clocks, loops that run only while needed, cached geometry and compositor-driven scroll motion.

### 9.1 Fixed-Step Sprite Clock That Sleeps Between Frames

**Impact: MEDIUM-HIGH (12fps sprites wake 12 times a second instead of 60 to 120, and stay in sync with timers)**

Don't run a `requestAnimationFrame` loop per sprite that checks elapsed time every refresh. Advance frames on a fixed step (`last += step`), allow drawing up to 8ms early so the nearest refresh takes the frame, then sleep with `setTimeout` until just before the next step. Reset the clock after long pauses instead of fast-forwarding. Stop off screen with an `IntersectionObserver`, and don't animate at all with reduced motion.

**Incorrect:**

```ts
const loop = (t: number) => {
  frame = Math.floor(t / (1000 / fps)) % frames; // drifts vs setTimeout-scheduled attacks
  draw();
  requestAnimationFrame(loop);                     // wakes every refresh, forever, even off screen
};
```

**Correct:**

```ts
const EARLY_MS = 8;
const step = 1000 / rate;
const tick = (t: number) => {
  raf = 0;
  if (last === 0 || t - last > step * frames) last = t;
  if (t - last >= step - EARLY_MS) {
    if (!loop && frame === frames - 1) return;
    frame = (frame + 1) % frames;
    last += step;
    draw();
  }
  wake = window.setTimeout(() => {
    wake = 0;
    raf = requestAnimationFrame(tick);
  }, Math.max(0, last + step - EARLY_MS - performance.now()));
};

const observer = new IntersectionObserver(([entry]) => {
  onScreen = entry.isIntersecting;
  if (onScreen) start(); else stop();
});
```

Keep `flipX` and `tint` in refs and redraw on change, so they never restart the clock or the effect.

### 9.2 Run Game Loops Only While Something Moves

**Impact: MEDIUM (zero per-frame work while no bullet is flying)**

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

### 9.3 Decode Sprite Images Once and Preload Them

**Impact: MEDIUM (sprites draw on their first frame and never refetch)**

Decode each sheet once and share it with every sprite that uses it. Preload critical sheets with `preload(src, { as: "image" })` during render, and the rest when idle. Keep a synchronous map of decoded images so a remounted sprite draws on its first frame.

**Correct:**

```ts
const imageCache = new Map<string, Promise<HTMLImageElement>>();
function loadImage(src: string) {
  let promise = imageCache.get(src);
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.decode().then(() => resolve(img)).catch(reject);
    });
    imageCache.set(src, promise);
  }
  return promise;
}

export function preloadSpritesWhenIdle(sheets: SpriteSheet[]) {
  const run = () => sheets.forEach(({ src }) => loadImage(src).catch(() => {}));
  if ("requestIdleCallback" in window) requestIdleCallback(run);
  else setTimeout(run, 200);
}
```

### 9.4 Drive Scroll-Linked Motion on the Compositor, in Whole-Pixel Steps

**Impact: MEDIUM (smooth scrolling on iOS; characters move in art-pixel steps like a game)**

Use scroll-driven CSS animations for reveals and for anything that tracks scroll (side characters moving down the page). Quantise with `steps(n, jump-none)`, where `n - 1` is the travel in art pixels, so the motion lands on whole pixels. Fall back to a snapped JS transform where `animation-timeline` is unsupported. Use `svh`/`lvh` probes rather than `innerHeight`, which jumps as mobile toolbars slide.

**Correct:**

```css
@keyframes companion-track {
  from { transform: translateY(var(--track-from)); }
  to   { transform: translateY(var(--track-to)); }
}
.companion-track.is-scroll-driven {
  animation: companion-track auto steps(var(--track-steps), jump-none) both;
  animation-timeline: scroll(root);
  animation-range: var(--range-start) var(--range-end);
}
```

```ts
const step = artPx();
t.style.setProperty("--track-steps", `${Math.max(2, Math.round((bottom - top) / step) + 1)}`);

// Unlike innerHeight, these ignore mobile toolbars sliding in and out.
function viewportHeights(probe: HTMLElement) {
  probe.style.height = "100svh"; const small = probe.offsetHeight;
  probe.style.height = "100lvh"; return { small, large: probe.offsetHeight };
}
```

Re-measure only when the key (width, small and large heights, scroll height) changes. Switch walk and idle animations from scroll activity: walk on scroll, back to idle 180ms after the last scroll event.

---

## 10. Tooling

**Impact: LOW-MEDIUM**

A dev-only design sheet with a live token tuner, and checks that prove the pixel rules hold.

### 10.1 A Dev-Only Design Sheet With a Live Token Tuner

**Impact: LOW-MEDIUM (refine the system visually with a collaborator before touching pages)**

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

Put the tuner's `sticky` on a wrapper, never on the shadowed card (see `shadow-ground-layer`). Show state (rest, hover, pressed) by setting `translate` inline on the faces of static copies.

### 10.2 Verify the Pixel Rules in a Real Browser

**Impact: LOW-MEDIUM (catches half pixels, stray stacking contexts and moving hit zones before users do)**

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

---
