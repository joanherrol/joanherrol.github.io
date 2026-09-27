---
title: Press Start Only for Display and Headlines
impact: HIGH
impactDescription: keeps the heavy display font special and reading text legible
tags: type, hierarchy, fonts, mapping
---

## Press Start Only for Display and Headlines

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
