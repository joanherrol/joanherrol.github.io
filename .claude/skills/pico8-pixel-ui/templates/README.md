# Templates

Core files from the reference implementation (a Next.js 16, React 19, Tailwind CSS v4 portfolio). Suggested places:

- `globals.css` → `app/globals.css`
- `pixel.ts`, `palette.ts`, `sound.ts`, `use-base-px.ts` → `lib/`
- the `.tsx` and `collision.ts` files → `components/retro/`
- `design-page.dev.tsx` → `app/design/page.dev.tsx`, `design-tuner.tsx` → `app/design/tuner.tsx`, and add `pageExtensions: process.env.NODE_ENV === "development" ? ["dev.tsx", "tsx", "ts"] : ["tsx", "ts"]` to `next.config.ts`

In `app/layout.tsx`, load Press Start 2P (`--font-display`) and Tiny5 (`--font-body`) with `next/font/google`, and inline `paletteBootScript` and `pixelBootScript` as the first scripts in `<body>`.

Project-specific parts to replace: sprite paths and the `ENEMIES` data, `PALETTES`, the cover selectors at the top of `collision.ts`, the `copy` imports, and the sound files in `/public/sfx`.
