// Bullet hitboxes in screen pixels. Shadows never count.

export type Rect = { left: number; top: number; right: number; bottom: number };

const COVERS = "main .card-cream, main .card-accent, main .float-body";
const TITLES = "main h1, main h2";

function onScreen(r: Rect) {
  return r.right > r.left && r.bottom > 0 && r.top < window.innerHeight;
}

function titleLines(title: Element, rects: Rect[]) {
  const range = document.createRange();
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || parent.closest(".drop-copy, button")) continue;
    // A marked word's accent ring is part of it; its shadow is not.
    const ring = parent.closest(".text-mark")
      ? Number.parseFloat(getComputedStyle(parent).fontSize) / 8
      : 0;
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (!onScreen(r)) continue;
      rects.push({
        left: r.left - ring,
        top: r.top - ring,
        right: r.right + ring,
        bottom: r.bottom + ring,
      });
    }
  }
}

/** Everything on screen that stops bullets: cards, frames and title lines. */
export function readCovers(): Rect[] {
  const rects: Rect[] = [];
  for (const el of document.querySelectorAll(COVERS)) {
    const r = el.getBoundingClientRect();
    if (onScreen(r)) rects.push(r);
  }
  for (const title of document.querySelectorAll(TITLES)) {
    if (onScreen(title.getBoundingClientRect())) titleLines(title, rects);
  }
  return rects;
}

export function spriteRects(track: HTMLElement | null): Rect[] {
  return [...(track?.querySelectorAll("canvas.sprite-solid") ?? [])].map((c) =>
    c.getBoundingClientRect(),
  );
}

/**
 * Where a bullet moving from `from` to `to` (its left edge) first touches a
 * box, counting boxes that scrolled `dy` onto it this frame. Returns the left
 * edge it stops at, and whether it was struck from above or below.
 */
export function firstHit(
  from: number,
  to: number,
  size: number,
  top: number,
  rects: Rect[],
  dy: number,
) {
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
