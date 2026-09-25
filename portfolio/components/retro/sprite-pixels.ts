export type SpritePixel = { x: number; y: number; color: string };

const cache = new Map<string, SpritePixel[]>();
const key = (src: string, flipX: boolean) => `${src}|${flipX}`;

export function loadSpritePixels(
  src: string,
  width: number,
  height: number,
  flipX = false,
) {
  const k = key(src, flipX);
  if (cache.has(k)) return;
  cache.set(k, []);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, width, height).data;
    const pixels: SpritePixel[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        if (data[i + 3] < 128) continue;
        pixels.push({
          x: flipX ? width - 1 - x : x,
          y,
          color: `rgb(${data[i]} ${data[i + 1]} ${data[i + 2]})`,
        });
      }
    }
    cache.set(k, pixels);
  };
  img.src = src;
}

export function spritePixels(src: string, flipX = false) {
  return cache.get(key(src, flipX)) ?? [];
}
