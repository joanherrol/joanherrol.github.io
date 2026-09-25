import { PixelSprite, type SpriteSheet } from "@/components/retro/pixel-sprite";
import {
  loadSpritePixels,
  spritePixels,
} from "@/components/retro/sprite-pixels";

type EnemyKind = {
  id: number;
  width: number;
  height: number;
  shadowWidth: number;
  shadowHeight: number;
  attackFrames: number;
  fireFrames: number[];
  muzzleTop: number;
  lift?: number;
  sink?: number;
  flipX?: boolean;
};

export const ENEMIES: EnemyKind[] = [
  {
    id: 1,
    width: 10,
    height: 10,
    shadowWidth: 10,
    shadowHeight: 10,
    attackFrames: 8,
    fireFrames: [2, 6],
    muzzleTop: 5,
  },
  {
    id: 2,
    width: 9,
    height: 16,
    shadowWidth: 7,
    shadowHeight: 3,
    attackFrames: 7,
    fireFrames: [3, 4, 5],
    muzzleTop: 3,
  },
  {
    id: 3,
    width: 15,
    height: 15,
    shadowWidth: 15,
    shadowHeight: 3,
    attackFrames: 9,
    fireFrames: [8],
    muzzleTop: 8,
    sink: 1,
  },
  {
    id: 4,
    width: 15,
    height: 12,
    shadowWidth: 15,
    shadowHeight: 3,
    attackFrames: 8,
    fireFrames: [5],
    muzzleTop: 3,
  },
  {
    id: 5,
    width: 10,
    height: 15,
    shadowWidth: 10,
    shadowHeight: 3,
    attackFrames: 8,
    fireFrames: [6],
    muzzleTop: 2,
  },
  {
    id: 6,
    width: 14,
    height: 13,
    shadowWidth: 14,
    shadowHeight: 5,
    attackFrames: 8,
    fireFrames: [7],
    muzzleTop: 2,
  },
  {
    id: 7,
    width: 12,
    height: 16,
    shadowWidth: 12,
    shadowHeight: 5,
    attackFrames: 14,
    fireFrames: [6, 9, 12],
    muzzleTop: 6,
    lift: -1,
    sink: -2,
  },
  {
    id: 8,
    width: 14,
    height: 12,
    shadowWidth: 14,
    shadowHeight: 5,
    attackFrames: 6,
    fireFrames: [3],
    muzzleTop: 8,
    sink: -1,
  },
  {
    id: 9,
    width: 10,
    height: 12,
    shadowWidth: 10,
    shadowHeight: 3,
    attackFrames: 9,
    fireFrames: [7],
    muzzleTop: 2,
    sink: -1,
  },
  {
    id: 10,
    width: 16,
    height: 12,
    shadowWidth: 16,
    shadowHeight: 3,
    attackFrames: 11,
    fireFrames: [3, 5, 7, 9],
    muzzleTop: 6,
    sink: -2,
    flipX: true,
  },
];

export const ENEMY_HP = 3;
export const HIT_MS = 240;
const ATTACK_FPS = 12;
const IDLE_FRAMES = 6;
const IDLE_FPS = 12;
export const IDLE_CYCLE_MS = (IDLE_FRAMES / IDLE_FPS) * 1000;

export type EnemyAnimation = "idle" | "walk" | "hit" | "attack";

export function attackTiming(kind: EnemyKind) {
  const frameMs = 1000 / ATTACK_FPS;
  return {
    duration: kind.attackFrames * frameMs,
    shots: kind.fireFrames.map((f) => f * frameMs),
  };
}

function sheet(kind: EnemyKind, animation: EnemyAnimation): SpriteSheet {
  const base = `/imgs/Enemies/Enemy${kind.id}/Enemy${kind.id}`;
  const frame = { frameWidth: kind.width, frameHeight: kind.height };
  if (animation === "attack") {
    return {
      src: `${base}-Attack.png`,
      ...frame,
      frames: kind.attackFrames,
      fps: ATTACK_FPS,
    };
  }
  if (animation === "hit") {
    return { src: `${base}-Hit.png`, ...frame, frames: 2, fps: 12 };
  }
  return {
    src: `${base}-${animation === "walk" ? "Walk" : "Idle"}.png`,
    ...frame,
    frames: IDLE_FRAMES,
    fps: IDLE_FPS,
  };
}

export function loadEnemyPixels(kind: EnemyKind) {
  loadSpritePixels(
    sheet(kind, "idle").src,
    kind.width,
    kind.height,
    kind.flipX,
  );
}

export function enemyPixels(kind: EnemyKind) {
  return spritePixels(sheet(kind, "idle").src, kind.flipX);
}

export function nextEnemy(current: EnemyKind) {
  const i = ENEMIES.indexOf(current);
  return ENEMIES[(i + 1) % ENEMIES.length];
}

export function Enemy({
  kind,
  scale,
  animation,
}: {
  kind: EnemyKind;
  scale: number;
  animation: EnemyAnimation;
}) {
  return (
    <div
      className="relative"
      style={{ width: kind.width * scale, height: kind.height * scale }}
    >
      <PixelSprite
        sheet={{
          src: `/imgs/Enemies/Enemy${kind.id}/Enemy${kind.id}Shadow.png`,
          frameWidth: kind.shadowWidth,
          frameHeight: kind.shadowHeight,
          frames: 1,
        }}
        scale={scale}
        flipX={kind.flipX}
        className="absolute"
        style={{
          left: ((kind.width - kind.shadowWidth) / 2) * scale,
          bottom: 0,
        }}
      />
      <PixelSprite
        sheet={sheet(kind, animation)}
        loop={animation !== "attack"}
        scale={scale}
        flipX={kind.flipX}
        className="absolute left-0"
        style={{ top: (kind.sink ?? 0) * scale }}
      />
    </div>
  );
}
