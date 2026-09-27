// Bullet collisions in screen pixels. Only solid things count: cards, tilted
// image frames, the ink of title words and the coloured pixels of sprites.
// Shadows never do.
import { solidRows } from "@/components/retro/pixel-sprite";

export type Box = { x: number; y: number; size: number };

/** A solid box, possibly tilted, by its centre and half extents. */
export type Cover = {
  key: string;
  cx: number;
  cy: number;
  hw: number;
  hh: number;
  cos: number;
  sin: number;
};

export type Hit = {
  /** How far along this frame's move the bullet touched, 0 to 1. */
  t: number;
  normal: [number, number];
  /** The point on the face it touched. */
  face: { x: number; y: number };
};

const CARDS = "main .card-cream, main .card-accent";
const FRAMES = "main .float-body";
const TITLES = "main h1, main h2";

function onScreen(r: DOMRect) {
  return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
}

function upright(
  key: string,
  left: number,
  top: number,
  width: number,
  height: number,
): Cover {
  const hw = width / 2;
  const hh = height / 2;
  return { key, cx: left + hw, cy: top + hh, hw, hh, cos: 1, sin: 0 };
}

type Ink = { left: number; right: number; top: number; bottom: number };
const inks = new Map<string, Ink>();
let measure: CanvasRenderingContext2D | null = null;

// Where the letters actually are inside a word's text box.
function ink(font: string, word: string): Ink {
  const key = `${font}|${word}`;
  const cached = inks.get(key);
  if (cached) return cached;
  measure ??= document.createElement("canvas").getContext("2d");
  if (!measure) return { left: 0, right: 0, top: 0, bottom: 0 };
  measure.font = font;
  const m = measure.measureText(word);
  const found = {
    left: -m.actualBoundingBoxLeft,
    right: m.actualBoundingBoxRight,
    top: m.fontBoundingBoxAscent - m.actualBoundingBoxAscent,
    bottom: m.fontBoundingBoxAscent + m.actualBoundingBoxDescent,
  };
  // Before the pixel fonts load, metrics are the fallback's.
  if (document.fonts.status === "loaded") inks.set(key, found);
  return found;
}

function titleWords(covers: Cover[]) {
  const range = document.createRange();
  document.querySelectorAll(TITLES).forEach((title, i) => {
    if (!onScreen(title.getBoundingClientRect())) return;
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    let n = 0;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || parent.closest(".drop-copy, button")) continue;
      const style = getComputedStyle(parent);
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      // A marked word's accent ring is part of it.
      const ring = parent.closest(".text-mark")
        ? Number.parseFloat(style.fontSize) / 8
        : 0;
      const upper = style.textTransform === "uppercase";
      for (const word of (node.textContent ?? "").matchAll(/\S+/g)) {
        range.setStart(node, word.index);
        range.setEnd(node, word.index + word[0].length);
        const box = range.getClientRects()[0];
        if (!box) continue;
        const m = ink(font, upper ? word[0].toUpperCase() : word[0]);
        covers.push(
          upright(
            `t${i}.${n++}`,
            box.left + m.left - ring,
            box.top + m.top - ring,
            m.right - m.left + ring * 2,
            m.bottom - m.top + ring * 2,
          ),
        );
      }
    }
  });
}

/** Everything on screen that stops bullets. */
export function readCovers(): Cover[] {
  const covers: Cover[] = [];
  document.querySelectorAll(CARDS).forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (onScreen(r))
      covers.push(upright(`c${i}`, r.left, r.top, r.width, r.height));
  });
  document.querySelectorAll<HTMLElement>(FRAMES).forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (!onScreen(r)) return;
    const angle =
      ((Number.parseFloat(getComputedStyle(el).rotate) || 0) * Math.PI) / 180;
    covers.push({
      key: `f${i}`,
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      hw: el.offsetWidth / 2,
      hh: el.offsetHeight / 2,
      cos: Math.cos(angle),
      sin: Math.sin(angle),
    });
  });
  titleWords(covers);
  return covers;
}

// A bullet's half width along a tilted box's axes.
function reach(size: number, { cos, sin }: Cover) {
  return (size / 2) * (Math.abs(cos) + Math.abs(sin));
}

function toLocal(x: number, y: number, c: Cover): [number, number] {
  const dx = x - c.cx;
  const dy = y - c.cy;
  return [dx * c.cos + dy * c.sin, -dx * c.sin + dy * c.cos];
}

/**
 * Where a bullet moving from `prev` to `now` first touches `cover`, measured
 * against where the cover was (`before`) so scrolling into a bullet counts.
 */
export function sweep(
  prev: Box,
  now: Box,
  cover: Cover,
  before: Cover | undefined,
  dir: number,
): Hit | null {
  const r = now.size / 2;
  const e = reach(now.size, cover);
  const a = toLocal(prev.x + r, prev.y + r, before ?? cover);
  const b = toLocal(now.x + r, now.y + r, cover);
  const half = [cover.hw + e, cover.hh + e];
  let enter = -Infinity;
  let exit = Infinity;
  let axis = -1;
  let side = 0;
  for (const k of [0, 1]) {
    const ds = b[k] - a[k];
    if (Math.abs(ds) < 1e-6) {
      if (Math.abs(a[k]) >= half[k]) return null;
      continue;
    }
    const t0 = (-half[k] - a[k]) / ds;
    const t1 = (half[k] - a[k]) / ds;
    const inT = Math.min(t0, t1);
    if (inT > enter) {
      enter = inT;
      axis = k;
      side = ds > 0 ? -1 : 1;
    }
    exit = Math.min(exit, Math.max(t0, t1));
  }
  if (enter >= exit || enter > 1 || exit <= 0) return null;

  // Already inside when last seen: it struck the face it flew at.
  if (enter < 0 || axis < 0) {
    const [lx, ly] = toLocal(now.x + r - dir * e, now.y + r, cover);
    return {
      t: 0,
      normal: [-dir, 0],
      face: world(cover, lx, ly),
    };
  }
  const local: [number, number] = [0, 0];
  local[axis] = side;
  const at = [a[0] + (b[0] - a[0]) * enter, a[1] + (b[1] - a[1]) * enter];
  at[axis] -= side * e;
  return {
    t: enter,
    normal: [
      local[0] * cover.cos - local[1] * cover.sin,
      local[0] * cover.sin + local[1] * cover.cos,
    ],
    face: world(cover, at[0], at[1]),
  };
}

function world(c: Cover, lx: number, ly: number) {
  return {
    x: c.cx + lx * c.cos - ly * c.sin,
    y: c.cy + lx * c.sin + ly * c.cos,
  };
}

/**
 * Along the bullet's row, the left edge x at which it rests against the
 * cover's face on the side it came from.
 */
export function restAgainst(box: Box, cover: Cover, dir: number) {
  const r = box.size / 2;
  const e = reach(box.size, cover);
  const y = box.y + r - cover.cy;
  let lo = -Infinity;
  let hi = Infinity;
  // Local x and y as the bullet centre slides along the row.
  for (const [slope, offset, half] of [
    [cover.cos, y * cover.sin, cover.hw + e],
    [-cover.sin, y * cover.cos, cover.hh + e],
  ]) {
    if (Math.abs(slope) < 1e-6) {
      if (Math.abs(offset) >= half) return null;
      continue;
    }
    const t0 = (-half - offset) / slope;
    const t1 = (half - offset) / slope;
    lo = Math.max(lo, Math.min(t0, t1));
    hi = Math.min(hi, Math.max(t0, t1));
  }
  if (lo >= hi) return null;
  return cover.cx + (dir > 0 ? lo : hi) - r;
}

/** The outer edges of the coloured pixels across a band of screen rows. */
function solidSpan(
  canvases: Iterable<HTMLCanvasElement>,
  top: number,
  bottom: number,
): [number, number] | null {
  let left = Infinity;
  let right = -Infinity;
  for (const canvas of canvases) {
    const rows = solidRows(canvas);
    if (!rows) continue;
    const r = canvas.getBoundingClientRect();
    const px = r.width / rows.width;
    const first = Math.max(0, Math.floor((top - r.top) / px));
    const last = Math.min(
      rows.spans.length - 1,
      Math.ceil((bottom - r.top) / px) - 1,
    );
    for (let y = first; y <= last; y++) {
      const span = rows.spans[y];
      if (!span) continue;
      left = Math.min(left, r.left + span[0] * px);
      right = Math.max(right, r.left + (span[1] + 1) * px);
    }
  }
  return left < right ? [left, right] : null;
}

/**
 * Whether a bullet reached a sprite this frame, and if so how far along its
 * move and at which left edge x it touches the first coloured pixel.
 */
export function strike(
  prev: Box,
  now: Box,
  dir: number,
  canvases: Iterable<HTMLCanvasElement>,
) {
  const span = solidSpan(canvases, now.y, now.y + now.size);
  if (!span) return null;
  const [left, right] = span;
  const from = Math.min(prev.x, now.x);
  const to = Math.max(prev.x, now.x) + now.size;
  if (to <= left || from >= right) return null;
  const x = dir > 0 ? left - now.size : right;
  const move = now.x - prev.x;
  const t = move ? Math.min(1, Math.max(0, (x - prev.x) / move)) : 0;
  return { t, x };
}
