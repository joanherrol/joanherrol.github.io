const ICONS = {
  external: [
    "...####",
    ".....##",
    "....#.#",
    "...#..#",
    "..#....",
    ".#.....",
    "#......",
  ],
  download: [
    "...#...",
    "...#...",
    ".#.#.#.",
    "..###..",
    "...#...",
    "#.....#",
    "#######",
  ],
  mail: [
    "########",
    "##....##",
    "#.#..#.#",
    "#..##..#",
    "#......#",
    "########",
  ],
  phone: [
    "##.....",
    "###....",
    ".##....",
    ".##....",
    "..##...",
    "...####",
    "....###",
  ],
  star: [
    "...#...",
    "...#...",
    "#######",
    ".#####.",
    "..###..",
    ".##.##.",
    "##...##",
  ],
  menu: ["#######", ".......", "#######", ".......", "#######"],
  github: [
    ".#.....#.",
    ".##...##.",
    ".#######.",
    "#########",
    "##.###.##",
    "#########",
    ".#######.",
    "..#...#..",
  ],
  linkedin: [
    "#......",
    ".......",
    "#.#.##.",
    "#.##..#",
    "#.#...#",
    "#.#...#",
    "#.#...#",
  ],
  itch: [
    ".#########.",
    "###.####.##",
    "##...##.#.#",
    "###.####.##",
    "###########",
    "###.....###",
    "##.......##",
  ],
  close: ["##...##", ".##.##.", "..###..", ".##.##.", "##...##"],
  check: ["......#", ".....##", "#...##.", "##.##..", ".###...", "..#...."],
} as const;

export type PixelIconName = keyof typeof ICONS;

type PixelIconProps = {
  name: PixelIconName;
  /** Px per icon pixel, or "text" to match the surrounding font pixel. */
  size?: number | "text";
  className?: string;
};

export function PixelIcon({
  name,
  size = 3,
  className,
}: Readonly<PixelIconProps>) {
  const rows = ICONS[name];
  const cols = rows[0].length;

  const rects: { x: number; y: number; w: number }[] = [];
  rows.forEach((row, y) => {
    let start = -1;
    for (let x = 0; x <= cols; x++) {
      const on = row[x] === "#";
      if (on && start < 0) start = x;
      if (!on && start >= 0) {
        rects.push({ x: start, y, w: x - start });
        start = -1;
      }
    }
  });

  return (
    <svg
      viewBox={`0 0 ${cols} ${rows.length}`}
      width={size === "text" ? `${cols / 8}em` : cols * size}
      height={size === "text" ? `${rows.length / 8}em` : rows.length * size}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={`shrink-0 ${className ?? ""}`}
    >
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} />
      ))}
    </svg>
  );
}
