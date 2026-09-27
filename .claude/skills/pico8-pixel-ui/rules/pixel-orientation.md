---
title: Size by Width and Height; Lay Out by Width and Orientation
impact: HIGH
impactDescription: landscape phones and portrait tablets stay balanced instead of inheriting the wrong sizes
tags: pixel, responsive, landscape, portrait, tablet, breakpoints
---

## Size by Width and Height; Lay Out by Width and Orientation

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

iOS 26 and later also blur a band below the status bar that is taller than the reported inset, and may report no bottom inset. So add fixed extra space in the installed app only, with `@media (display-mode: standalone)` plus a `.standalone` class set from `navigator.standalone` in the boot script: `--safe-t: calc(env(safe-area-inset-top, 0px) + var(--app-t))`, with `--app-t: 16px` and `--app-b: 24px` there.

For JS-positioned sprites, read the insets from a probe's computed padding (`padding: var(--safe-t) var(--safe-r) var(--safe-b) var(--safe-l)`). Keep that probe on the page and re-read it from a `ResizeObserver` (`box: "border-box"`), because iOS can resolve the insets after load without firing a resize. Test by overriding the `--safe-*` variables, because desktop browsers can't emulate them.

`@media not (a) and (b)` is invalid CSS, so avoid `not-sm:` once `sm` has two conditions; write the media query explicitly. Check 390×844, 844×390, 667×375, 820×1180, 1180×820, 768×1024 and 1440×900. A browser `deviceScaleFactor` below 1 changes `--ipx` and doubles every size, so test at 1 or 2.
