"use client";

import { useCallback, useRef, useState } from "react";
import { preload } from "react-dom";
import {
  PixelSprite,
  preloadSprites,
  type SpriteSheet,
} from "@/components/retro/pixel-sprite";

const FRAME = { frameWidth: 8, frameHeight: 10 };
const GUN_FRAME = { frameWidth: 6, frameHeight: 6 };
const GUN_SHADOW_FRAME = { frameWidth: 8, frameHeight: 3 };

export const PLAYER_SPRITES = {
  idle: { src: "/imgs/Player/PlayerIdle.png", ...FRAME, frames: 6, fps: 12 },
  walk: { src: "/imgs/Player/PlayerWalk.png", ...FRAME, frames: 6, fps: 12 },
  shadow: {
    src: "/imgs/Player/Shadow.png",
    frameWidth: 8,
    frameHeight: 3,
    frames: 1,
  },
} satisfies Record<string, SpriteSheet>;

const WEAPON_SPRITES = {
  idle: { src: "/imgs/Weapons/GunIdle.png", ...GUN_FRAME, frames: 1 },
  shoot: {
    src: "/imgs/Weapons/GunShoot.png",
    ...GUN_FRAME,
    frames: 3,
    fps: 12,
  },
  shadowIdle: {
    src: "/imgs/Weapons/ShadowGunIdle.png",
    ...GUN_SHADOW_FRAME,
    frames: 1,
  },
  shadowShoot: {
    src: "/imgs/Weapons/ShadowGunShoot.png",
    ...GUN_SHADOW_FRAME,
    frames: 3,
    fps: 12,
  },
} satisfies Record<string, SpriteSheet>;

const ALL_SPRITES = [
  ...Object.values(PLAYER_SPRITES),
  ...Object.values(WEAPON_SPRITES),
];

export function usePlayerSpritePreload() {
  for (const { src } of ALL_SPRITES) preload(src, { as: "image" });
}

export function preloadPlayerSprites() {
  preloadSprites(ALL_SPRITES);
}

const HURT_TINT = "#ff004d";

const SHOOT_MS = 250;
export const BULLET_MS = 1000;

const GUN = { left: -5, right: 7, top: 2 };
const GUN_SHADOW = { left: -6, right: 5, top: 9 };
export const MUZZLE = { left: -5, right: 12, top: 4 };

type PlayerAnimation = "idle" | "walk";

type PlayerProps = {
  animation?: PlayerAnimation;
  scale?: number;
  flipX?: boolean;
  shadow?: boolean;
  dropShadow?: boolean;
  weapon?: boolean;
  shooting?: boolean;
  hurt?: boolean;
  bullets?: number[];
  label?: string;
  className?: string;
};

export function Player({
  animation = "idle",
  scale = 4,
  flipX = false,
  shadow = true,
  dropShadow = false,
  weapon = true,
  shooting = false,
  hurt = false,
  bullets = [],
  label,
  className = "",
}: Readonly<PlayerProps>) {
  const side = flipX ? "right" : "left";
  const tint = hurt ? HURT_TINT : undefined;

  return (
    <div
      className={`relative ${className}`}
      style={
        {
          width: 8 * scale,
          height: (shadow ? 11 : 10) * scale,
          "--px": `${scale}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0"
        style={
          dropShadow
            ? {
                filter: `drop-shadow(-${scale}px 0 0 #000) drop-shadow(0 ${scale}px 0 #000)`,
              }
            : undefined
        }
      >
        {shadow && weapon && (
          <PixelSprite
            sheet={
              shooting ? WEAPON_SPRITES.shadowShoot : WEAPON_SPRITES.shadowIdle
            }
            loop={false}
            scale={scale}
            flipX={flipX}
            className="absolute"
            style={{
              left: GUN_SHADOW[side] * scale,
              top: GUN_SHADOW.top * scale,
            }}
          />
        )}
        {shadow && (
          <PixelSprite
            sheet={PLAYER_SPRITES.shadow}
            scale={scale}
            className="absolute left-0"
            style={{ top: 9 * scale }}
          />
        )}
        <PixelSprite
          sheet={PLAYER_SPRITES[animation]}
          scale={scale}
          flipX={flipX}
          tint={tint}
          label={label}
          className="absolute left-0 top-0"
        />
        {weapon && (
          <PixelSprite
            sheet={shooting ? WEAPON_SPRITES.shoot : WEAPON_SPRITES.idle}
            loop={false}
            scale={scale}
            flipX={flipX}
            className="absolute"
            style={{ left: GUN[side] * scale, top: GUN.top * scale }}
          />
        )}
      </div>
      {weapon && (
        <Bullets
          bullets={bullets}
          scale={scale}
          flipX={flipX}
          floor={dropShadow ? 6 : 5}
        />
      )}
    </div>
  );
}

function Bullets({
  bullets,
  scale,
  flipX = false,
  floor = 5,
}: Readonly<{
  bullets: number[];
  scale: number;
  flipX?: boolean;
  floor?: number;
}>) {
  const side = flipX ? "right" : "left";
  return bullets.map((id) => (
    <span
      key={id}
      aria-hidden="true"
      className={`pixel-bullet absolute ${flipX ? "" : "is-left"}`}
      style={
        {
          left: MUZZLE[side] * scale,
          top: MUZZLE.top * scale,
          width: scale,
          height: scale,
          "--floor": floor,
        } as React.CSSProperties
      }
    />
  ));
}

function useOneShot(duration: number) {
  const [active, setActive] = useState(false);
  const busy = useRef(false);
  const trigger = useCallback(() => {
    if (busy.current) return false;
    busy.current = true;
    setActive(true);
    setTimeout(() => {
      busy.current = false;
      setActive(false);
    }, duration);
    return true;
  }, [duration]);
  return [active, trigger] as const;
}

export function useShoot() {
  const [shooting, recoil] = useOneShot(SHOOT_MS);
  const [bullets, setBullets] = useState<number[]>([]);
  const nextId = useRef(0);
  const removeBullet = useCallback(
    (id: number) => setBullets((b) => b.filter((x) => x !== id)),
    [],
  );
  const shoot = useCallback(() => {
    if (!recoil()) return null;
    const id = nextId.current++;
    setBullets((b) => [...b, id]);
    setTimeout(() => removeBullet(id), BULLET_MS);
    return id;
  }, [recoil, removeBullet]);
  return { shooting, bullets, shoot, removeBullet };
}
