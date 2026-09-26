// Pixel art stays crisp only on whole device pixels, which zoom makes fractional.

function ratio() {
  return window.devicePixelRatio || 1;
}

/** The nearest length that covers a whole number of device pixels. */
export function devicePx(px: number) {
  return Math.round(px * ratio()) / ratio();
}

/** One art pixel: about 1px, snapped to a whole number of device pixels. */
export function artPx() {
  return Math.max(1, Math.round(ratio())) / ratio();
}

// Sets --ipx before paint and again on zoom, which fires resize.
export const pixelBootScript = `(function(){var r=document.documentElement;function s(){var d=window.devicePixelRatio||1;r.style.setProperty("--ipx",Math.max(1,Math.round(d))/d+"px")}s();addEventListener("resize",s)})()`;
