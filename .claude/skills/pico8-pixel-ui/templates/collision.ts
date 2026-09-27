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
    if (node.parentElement?.closest(".drop-copy, button")) continue;
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) if (onScreen(r)) rects.push(r);
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
 * The first box a bullet reached this frame, sweeping from its last position
 * so it never skips through, and the x of the face it touched.
 */
export function firstHit(prev: Rect, now: Rect, rects: Rect[], dir: number) {
  const left = Math.min(prev.left, now.left);
  const right = Math.max(prev.right, now.right);
  let best: { x: number } | null = null;
  for (const r of rects) {
    if (r.right <= left || r.left >= right) continue;
    if (r.bottom <= now.top || r.top >= now.bottom) continue;
    const x =
      dir > 0 ? Math.max(r.left, prev.left) : Math.min(r.right, prev.right);
    if (!best || (dir > 0 ? x < best.x : x > best.x)) best = { x };
  }
  return best;
}
