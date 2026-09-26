// Run with `npm run images` after adding or changing images in public/imgs.
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "assets/images");
const OUT = path.join(ROOT, "public/imgs/opt");

// Keep in sync with images.deviceSizes and images.imageSizes in next.config.ts.
const WIDTHS = [96, 160, 240, 320, 480, 640, 960, 1280];

// Photos and logos get responsive WebP; pixel art stays lossless at native size.
const RESPONSIVE = [
  "portrait.jpg",
  "Incheon_National_University.png",
  "fib-upc-logo.png",
  "monlau-esobat-cat.png",
];
const PIXEL_ART = ["ShootEmUp.png", "PugAdventure.png"];

const manifest = {};

async function responsive() {
  for (const name of RESPONSIVE) {
    const src = path.join(SRC, name);
    const { width } = await sharp(src).metadata();
    const widths = [...new Set(WIDTHS.map((w) => Math.min(w, width)))];
    const base = path.parse(name).name;
    for (const w of widths) {
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({
          quality: 80,
          alphaQuality: 90,
          effort: 6,
          smartSubsample: true,
        })
        .toFile(path.join(OUT, `${base}-${w}.webp`));
    }
    manifest[`/imgs/${name}`] = { base: `/imgs/opt/${base}`, widths };
  }
}

// Scaled up by CSS, so one lossless file serves every width.
async function pixelArt() {
  for (const name of PIXEL_ART) {
    const src = path.join(SRC, name);
    const { width } = await sharp(src).metadata();
    const base = path.parse(name).name;
    await sharp(src)
      .webp({ lossless: true, effort: 6 })
      .toFile(path.join(OUT, `${base}-${width}.webp`));
    manifest[`/imgs/${name}`] = { base: `/imgs/opt/${base}`, widths: [width] };
  }
}

// Favicons from the first idle frame of Enemy1, scaled by whole pixels.
async function favicons() {
  const frame = await sharp(
    path.join(ROOT, "public/imgs/Enemies/Enemy1/Enemy1-Idle.png"),
  )
    .extract({ left: 0, top: 0, width: 10, height: 10 })
    .toBuffer();
  const icon = (art, canvas, background) => {
    const pad = (canvas - 10 * art) / 2;
    const img = sharp(frame)
      .resize(10 * art, 10 * art, { kernel: "nearest" })
      .extend({
        top: pad,
        bottom: pad,
        left: pad,
        right: pad,
        background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
      });
    return (background ? img.flatten({ background }) : img).png({
      compressionLevel: 9,
    });
  };
  await icon(3, 32).toFile(path.join(ROOT, "app/icon.png"));
  await icon(16, 180, "#1d2b53").toFile(path.join(ROOT, "app/apple-icon.png"));

  const { data } = await sharp(frame)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rects = [];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const i = (y * 10 + x) * 4;
      if (data[i + 3] < 128) continue;
      const fill = `#${[0, 1, 2].map((c) => data[i + c].toString(16).padStart(2, "0")).join("")}`;
      rects.push(
        `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`,
      );
    }
  }
  await writeFile(
    path.join(ROOT, "app/icon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 12 12" shape-rendering="crispEdges">${rects.join("")}</svg>\n`,
  );
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await Promise.all([responsive(), pixelArt(), favicons()]);
await writeFile(
  path.join(ROOT, "lib/image-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
