export type BurstPiece = {
  x: number;
  y: number;
  color: string;
  dx: number;
  dy: number;
};

export const FLASH_COLORS = {
  player: ["#fff1e8", "#ffec27", "#ffa300"],
  enemy: ["#ff004d", "#ffa300", "#fff1e8"],
} as const;

// Deterministic 0..1 noise, so a flash looks the same on every render.
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const FLASH_PIECES = 6;
const FLASH_CONE = (100 * Math.PI) / 180;

/** A cone of pixels out of a muzzle facing `dir` (1 right, -1 left). */
export function flashPieces(
  dir: number,
  colors: readonly string[],
  seed: number,
): BurstPiece[] {
  return Array.from({ length: FLASH_PIECES }, (_, i) => {
    const spread = i / (FLASH_PIECES - 1) - 0.5 + (noise(seed + i) - 0.5) * 0.2;
    const angle = spread * FLASH_CONE;
    const distance = 3 + noise(seed + i + 0.5) * 4;
    return {
      x: 0,
      y: 0,
      color: colors[i % colors.length],
      dx: dir * Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
    };
  });
}

export function PixelBurst({
  pieces,
  scale,
  top = 0,
  className = "",
  style,
}: Readonly<{
  pieces: BurstPiece[];
  scale: number;
  top?: number;
  className?: string;
  style?: React.CSSProperties;
}>) {
  return (
    <div className={`absolute ${className}`} style={style}>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="pixel-burst absolute"
          style={
            {
              left: p.x * scale,
              top: (p.y + top) * scale,
              width: scale,
              height: scale,
              background: p.color,
              "--dx": `${p.dx * scale}px`,
              "--dy": `${p.dy * scale}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
