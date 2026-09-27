---
name: pico8-pixel-ui
description: PICO-8 pixel-art design system and game-layer techniques for web UIs (React, Next.js, Tailwind CSS v4). Use when building, reviewing or refactoring a retro or pixel-art interface, when choosing pixel sizes, colours, fonts, shadows, buttons or image frames in that style, or when adding sprite characters, enemies, attack animations, bullets, collisions, particles or game sounds to a web page. Triggers on PICO-8, pixel art, retro UI, 8-bit, sprite sheet, pixel font, Press Start 2P, Tiny5, integer scaling, drop shadow, shoot-em-up on a website.
license: MIT
metadata:
  author: joan-hervas
  version: "1.0.0"
---

# PICO-8 Pixel UI

A strict design system for flat pixel-art UIs that match PICO-8-style game characters, plus the techniques for animating those characters, their shadows, shots and collisions on a web page. It holds 46 rules across 10 categories, ordered by impact. The rules are strict: if something can't be built within them, change the design, not the rule.

## When to Apply

- Starting a pixel-art or retro-game-styled site or app
- Choosing pixel sizes, spacing, type, colours, shadows, outlines or frames in that style
- Building buttons, menus, cards or image frames for it
- Adding sprite characters or enemies: sheets, layering, idle, walk, attack and hit animations
- Adding shooting, bullets, collisions, sparks, deaths and respawns
- Reviewing pixel UI for half pixels, off-palette colours, broken shadows or janky animation

## The Five Laws

1. **Nothing renders a half pixel.** Every length is whole device pixels (`--ipx`), scaled by whole steps.
2. **Only the 32 PICO-8 colours, flat.** No opacity, gradients or coloured shading at rest.
3. **Shadows are black, down and right, in title pixels (`--s`)** (1 for titles and resting cards, 2 for floating things), drawn as solid same-shape copies on a ground layer. Never animate the shadowed element itself.
4. **No black outlines.** Contrast comes from flat colour, spacing and shadow.
5. **Two 8-pixel fonts.** Press Start 2P only for display and headlines; Tiny5 for everything else.

## Rule Categories by Priority

| Priority | Category                           | Impact      | Prefix     |
| -------- | ---------------------------------- | ----------- | ---------- |
| 1        | Pixel Grid                         | CRITICAL    | `pixel-`   |
| 2        | Colour                             | CRITICAL    | `color-`   |
| 3        | Shadows and Layers                 | CRITICAL    | `shadow-`  |
| 4        | Typography                         | HIGH        | `type-`    |
| 5        | Pressables and Motion              | HIGH        | `press-`   |
| 6        | Outlines and Surfaces              | MEDIUM-HIGH | `surface-` |
| 7        | Sprites and Animation              | HIGH        | `sprite-`  |
| 8        | Combat: Bullets, Collisions, Effects | MEDIUM-HIGH | `combat-` |
| 9        | Performance                        | MEDIUM      | `perf-`    |
| 10       | Tooling                            | LOW-MEDIUM  | `tool-`    |

## Quick Reference

### 1. Pixel Grid (CRITICAL)

- `pixel-device-unit` - Set `--ipx` to one device pixel before paint with a boot script
- `pixel-integer-lengths` - Fixed lengths are `calc(var(--ipx) * n)`; fluid ones use `round(…, var(--ipx))`
- `pixel-base-spacing` - Spacing counts base pixels P (2 device px on phones, 3 from 40rem)
- `pixel-orientation` - Sizes need width and height; layouts follow width and orientation; short screens keep phone sizes
- `pixel-em-glyph-units` - Inside text, 0.125em is one glyph pixel for borders, gaps and icons
- `pixel-canvas-blocks` - Draw sprites as `round(scale × dpr)` device-pixel blocks with no smoothing
- `pixel-art-svg` - Hand-draw UI art as string rows rendered to crisp SVG in token colours

### 2. Colour (CRITICAL)

- `color-palette-only` - Switch Tailwind colours off; define only the 32 PICO-8 colours
- `color-no-blending` - No opacity, alpha or gradients at rest; muted text is a muted colour
- `color-flat-with-detail` - No coloured shading or bevels; drawn highlights and black depth pixels are welcome
- `color-theme-roles` - Themes set background, second background and accent, applied before paint

### 3. Shadows and Layers (CRITICAL)

- `shadow-title-pixel-unit` - Every shadow is sized in the title glyph pixel `--s`
- `shadow-solid-copy` - A black same-shape copy (resting: 1 along whole edges; floating: grown, 2 showing), never a band
- `shadow-ground-layer` - Shadows at z −1 with no stacking contexts above; reveals fill `backwards`
- `shadow-wrap-to-animate` - Animate a wrapper, never the shadowed element; frame shadows tilt but don't bob
- `shadow-title-drop-copy` - Title shadows are an aria-hidden black text copy on the ground
- `shadow-sprite-ground` - Characters and bullets use only top-down ground shadows

### 4. Typography (HIGH)

- `type-glyph-pixel` - Font size = 8 × a whole-device-pixel glyph token; no weights, no smoothing
- `type-fifteen-styles` - Five roles × lg, md, sm as `type-*` utilities
- `type-role-mapping` - Press Start for the hero and section titles only; Tiny5 for the rest
- `type-line-and-tracking` - Line heights in eighths; tracking 0.125em or 0.25em

### 5. Pressables and Motion (HIGH)

- `press-float-raise` - Float 1 `--s`, lift 1 own pixel on hover, sit flush when pressed, all with a registered `--raise`
- `press-fixed-hit-zone` - The element ignores the pointer; an `::after` fixed at rest takes it
- `press-menu-rows` - Hovered and selected menu rows share the accent fill
- `press-float-frames` - Frames start upright, then bob 2 px and sway ±1°; the shadow only sways
- `press-feedback-motion` - Scroll-timeline reveals, solid red hurt flashes, `steps(1)` blinks, reduced motion
- `press-sound-delegation` - `data-sound` plus one listener; loudness-normalised, pitch-jittered

### 6. Outlines and Surfaces (MEDIUM-HIGH)

- `surface-no-black-outlines` - No black outlines; exceptions are the accent ring, focus ring, hue-matched lights and menu dividers
- `surface-image-frames` - Window frame (title bar, lights) and console frame (D-pad, bezel, recessed screen)

### 7. Sprites and Animation (HIGH)

- `sprite-sheet-format` - Horizontal strips at 12fps; per-character quirks in typed data
- `sprite-layer-composition` - Gun shadow, body shadow, body, gun; per-facing offsets; canvas flip
- `sprite-align-shadows` - Lift each enemy so its shadow top meets the player's floor row
- `sprite-attack-transitions` - Enter attacks from the matching idle frame and resume idle from the matching frame
- `sprite-muzzle-spawn` - Spawn shots and cone flashes at the muzzle on the recoil frame
- `sprite-burst-and-respawn` - Burst the on-screen frame's pixels, snap hidden, then slide the next one in

### 8. Combat: Bullets, Collisions, Effects (MEDIUM-HIGH)

- `combat-bullet-layers` - CSS-animated fixed bullets; shadow, bullet and lane-clipped layers
- `combat-covers-not-shadows` - Cards, tilted frames and title-word ink stop bullets; shadows never do
- `combat-swept-collision` - Sweep each move against where covers were; the earliest hit wins
- `combat-pixel-masks` - Hit characters at their first coloured pixel via cached row spans
- `combat-land-flush` - Freeze every bullet copy on the face and spark along its normal

### 9. Performance (MEDIUM)

- `perf-fixed-step-clock` - Sprites advance on fixed steps, sleep between frames and stop off screen
- `perf-loops-only-while-needed` - The collision loop runs only while bullets fly; state lives in refs
- `perf-cache-pixel-reads` - Cache alpha, spans, ink metrics and decoded images
- `perf-compositor-scroll` - Scroll-driven CSS in whole-art-pixel `steps()`; svh and lvh probes

### 10. Tooling (LOW-MEDIUM)

- `tool-design-sheet` - A dev-only `page.dev.tsx` sheet with a live whole-pixel token tuner
- `tool-verify-pixels` - Playwright checks for whole glyph pixels, stacking contexts, hit zones and flush impacts

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/pixel-device-unit.md
rules/sprite-attack-transitions.md
```

Each rule file has a short explanation of why it matters, an incorrect example with an explanation, a correct example with an explanation, and extra context.

## Starting a New Project

`templates/` holds the reference implementation's core files. Copy them in, then adapt the content-specific parts (selectors in `collision.ts`, sprite paths and enemy data, palettes, section names):

| File                                     | Provides                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| `globals.css`                            | Palette, `--ipx`/`--p`/`--s`, 15 type tokens and utilities, shadows, pressables, frames, reveals, bullets |
| `pixel.ts`                               | `pixelBootScript`, `artPx`, `devicePx`, `basePx`                               |
| `palette.ts`                             | Token-referencing palettes, `applyPalette`, `paletteBootScript`                |
| `ui.tsx`                                 | Section, DropText, Mark, PixelButton, dropdown, TitleBar, WindowFrame, ConsoleFrame, PixelArt |
| `pixel-sprite.tsx`                       | Canvas sprite renderer with a fixed-step clock, tint, preload and `solidRows` masks |
| `player.tsx`, `enemy.tsx`                | Layered player with gun and bullets, `useShoot`; enemy data and attack timing  |
| `player-companion.tsx`                   | The game loop: tracks, attacks, shots, collisions, hurt, bursts, respawns      |
| `collision.ts`, `pixel-burst.tsx`        | Covers, swept hits, sprite strikes; flash and spark particles                  |
| `sound.ts`                               | Opt-in Web Audio with loudness normalisation and `data-sound` delegation       |
| `design-page.dev.tsx`, `design-tuner.tsx`| The dev-only design sheet and token tuner                                      |

Build order: boot scripts, then tokens (`globals.css`), then the design sheet (tune sizes there first), then components, then the game layer.

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`. After editing a rule, rebuild it with `node scripts/build-agents.mjs`.
