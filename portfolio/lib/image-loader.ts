import manifest from "./image-manifest.json";

type Entry = { base: string; widths: number[] };

// Serves the pre-built WebP from `npm run images` closest above the width.
export default function imageLoader({
  src,
  width,
}: Readonly<{ src: string; width: number }>) {
  const entry = (manifest as Record<string, Entry>)[src];
  if (!entry) return src;
  const fit = entry.widths.find((w) => w >= width) ?? entry.widths.at(-1);
  return `${entry.base}-${fit}.webp`;
}
