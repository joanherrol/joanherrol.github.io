# Sections

Section order, prefixes and impact. Rule files are named `<prefix>-<name>.md`.

## 1. Pixel Grid (pixel)

**Impact:** CRITICAL
**Description:** The one rule everything else serves: nothing ever renders a half pixel. Every length is a whole number of device pixels, scaled by whole steps.
**Rules:** device-unit, integer-lengths, base-spacing, orientation, em-glyph-units, canvas-blocks, art-svg

## 2. Colour (color)

**Impact:** CRITICAL
**Description:** Only the 32 PICO-8 colours, flat, with no blending at rest. Themes swap three roles.
**Rules:** palette-only, no-blending, flat-with-detail, theme-roles

## 3. Shadows and Layers (shadow)

**Impact:** CRITICAL
**Description:** Black, down and right, drawn as solid same-shape copies on a ground layer that sits under projectiles. Most visual bugs in this system are stacking-context bugs.
**Rules:** title-pixel-unit, solid-copy, ground-layer, wrap-to-animate, title-drop-copy, sprite-ground

## 4. Typography (type)

**Impact:** HIGH
**Description:** Two 8-pixel fonts, fifteen styles, each with a glyph pixel of whole device pixels.
**Rules:** glyph-pixel, fifteen-styles, role-mapping, line-and-tracking

## 5. Pressables and Motion (press)

**Impact:** HIGH
**Description:** Buttons float, lift one of their own pixels on hover and sit flush when pressed, with a hit zone that never moves. Floating frames, reveals and feedback.
**Rules:** float-raise, fixed-hit-zone, menu-rows, float-frames, feedback-motion, sound-delegation

## 6. Outlines and Surfaces (surface)

**Impact:** MEDIUM-HIGH
**Description:** No black outlines; contrast from flat colour, spacing and shadow. Short list of allowed exceptions and the two image frames.
**Rules:** no-black-outlines, image-frames

## 7. Sprites and Animation (sprite)

**Impact:** HIGH
**Description:** Canvas sprite sheets drawn in whole device-pixel blocks, layered body, gun and shadows, and momentum-matched idle and attack transitions.
**Rules:** sheet-format, layer-composition, align-shadows, attack-transitions, muzzle-spawn, burst-and-respawn

## 8. Combat: Bullets, Collisions, Effects (combat)

**Impact:** MEDIUM-HIGH
**Description:** Bullets move on CSS, collide against solid things only (never shadows), stop flush on the face they reach and spark off it.
**Rules:** bullet-layers, covers-not-shadows, swept-collision, pixel-masks, land-flush

## 9. Performance (perf)

**Impact:** MEDIUM
**Description:** Sleeping sprite clocks, loops that run only while needed, cached geometry and compositor-driven scroll motion.
**Rules:** fixed-step-clock, loops-only-while-needed, cache-pixel-reads, compositor-scroll

## 10. Tooling (tool)

**Impact:** LOW-MEDIUM
**Description:** A dev-only design sheet with a live token tuner, and checks that prove the pixel rules hold.
**Rules:** design-sheet, verify-pixels
