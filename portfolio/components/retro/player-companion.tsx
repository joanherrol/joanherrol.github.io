"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BULLET_MS,
  MUZZLE,
  PLAYER_SPRITES,
  Player,
  preloadPlayerSprites,
  useShoot,
} from "@/components/retro/player";
import {
  loadSpritePixels,
  spritePixels,
  type SpritePixel,
} from "@/components/retro/sprite-pixels";
import {
  attackTiming,
  ENEMY_HP,
  Enemy,
  enemyPixels,
  HIT_MS,
  IDLE_CYCLE_MS,
  loadEnemyPixels,
  nextEnemy,
  preloadEnemySprites,
  ENEMIES,
  type EnemyAnimation,
} from "@/components/retro/enemy";

const PHONE_SCALE = 3;
const PHONE_EDGE = 20;
const PHONE_SHOW_AT = 0.6;

function phoneStart(vh: number) {
  const last = document.querySelector<HTMLElement>("main > section:last-child");
  return last ? last.offsetTop - vh * PHONE_SHOW_AT : 0;
}

// Unlike innerHeight, these ignore mobile toolbars sliding in and out.
function viewportHeights(probe: HTMLElement) {
  probe.style.height = "100svh";
  const small = probe.offsetHeight;
  probe.style.height = "100lvh";
  return { small, large: probe.offsetHeight };
}
const TOP = 72;
const BOTTOM = 12;
const BURST_MS = 500;
const IDLE_CYCLES_PER_ATTACK = 4;
const PLAYER_HP = 3;
const PLAYER_RESPAWN_MS = 2000;
const HURT_MS = 300;
const BODY_WIDTH = 8;
const BODY_HEIGHT = 10;
const BOX_HEIGHT = 11;
const FLOOR_ROW = 9;

// Shots keep their screen height: scrolling dodges them.
type Shot = {
  id: number;
  from: "player" | "enemy";
  x: number;
  y: number;
  floor: number;
};

function overlaps(top: number, height: number, top2: number, height2: number) {
  return top < top2 + height2 && top2 < top + height;
}
type BurstPiece = {
  x: number;
  y: number;
  color: string;
  dx: number;
  dy: number;
};

function burstPieces(
  pixels: SpritePixel[],
  width: number,
  height: number,
): BurstPiece[] {
  const cx = width / 2;
  const cy = height / 2;
  return pixels.map(({ x, y, color }) => {
    const angle =
      Math.atan2(y + 0.5 - cy, x + 0.5 - cx) + (Math.random() - 0.5) * 0.5;
    const distance = 4 + Math.random() * 8;
    return {
      x,
      y,
      color,
      dx: Math.round(Math.cos(angle) * distance),
      dy: Math.round(Math.sin(angle) * distance),
    };
  });
}

function PixelBurst({
  pieces,
  scale,
  top = 0,
  className = "",
  style,
}: {
  pieces: BurstPiece[];
  scale: number;
  top?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
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

type Phase = "alive" | "bursting" | "gone";

function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

function slideInAfterBurst(
  respawn: () => void,
  show: () => void,
  after = BURST_MS / 2,
) {
  setTimeout(() => {
    respawn();
    requestAnimationFrame(() => requestAnimationFrame(show));
  }, after);
}

type EnemyState = {
  kind: (typeof ENEMIES)[number];
  hp: number;
  phase: Phase | "hit";
  attacking: boolean;
};

export function PlayerCompanion() {
  const trackRef = useRef<HTMLDivElement>(null);
  const enemyTrackRef = useRef<HTMLDivElement>(null);
  const [walking, setWalking] = useState(false);
  const walkingRef = useLatest(walking);
  const [scale, setScale] = useState(0);
  const [atBottomOnly, setAtBottomOnly] = useState(false);
  const [visible, setVisible] = useState(false);
  const visibleRef = useLatest(visible);
  const { shooting, shoot } = useShoot();
  const [shots, setShots] = useState<Shot[]>([]);
  const nextShot = useRef(0);
  const removeShot = useCallback(
    (id: number) => setShots((all) => all.filter((s) => s.id !== id)),
    [],
  );
  const addShot = useCallback(
    (shot: Omit<Shot, "id">) => {
      const id = nextShot.current++;
      setShots((all) => [...all, { ...shot, id }]);
      setTimeout(() => removeShot(id), BULLET_MS);
      return id;
    },
    [removeShot],
  );
  const [enemy, setEnemy] = useState<EnemyState>({
    kind: ENEMIES[0],
    hp: ENEMY_HP,
    phase: "alive",
    attacking: false,
  });
  const [burst, setBurst] = useState<{
    kind: EnemyState["kind"];
    pieces: BurstPiece[];
  } | null>(null);
  const [player, setPlayer] = useState<{ hp: number; phase: Phase }>({
    hp: PLAYER_HP,
    phase: "alive",
  });
  const playerRef = useLatest(player);
  const [playerBurst, setPlayerBurst] = useState<BurstPiece[] | null>(null);

  useEffect(() => {
    preloadPlayerSprites();
    preloadEnemySprites();
    ENEMIES.forEach(loadEnemyPixels);
    const { src, frameWidth, frameHeight } = PLAYER_SPRITES.idle;
    loadSpritePixels(src, frameWidth, frameHeight, true);
  }, []);
  const [hurt, setHurt] = useState(false);
  const hurtTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enemyRef = useLatest(enemy);

  useEffect(() => {
    const read = () => {
      const laneScale =
        Number(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--companion-scale",
          ),
        ) || 0;
      setAtBottomOnly(laneScale === 0);
      setScale(laneScale || PHONE_SCALE);
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    const scrollDriven = CSS.supports("animation-timeline", "scroll()");
    const tracks = [trackRef.current, enemyTrackRef.current];
    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;top:0;width:0;visibility:hidden";
    document.body.append(probe);
    let m = { start: 0, max: 0, top: 0, bottom: 0, showAt: 0 };
    let key = "";

    const measure = () => {
      const { small, large } = viewportHeights(probe);
      const height = document.documentElement.scrollHeight;
      const next = `${window.innerWidth} ${small} ${large} ${height}`;
      if (next === key) return;
      key = next;
      const max = height - large;
      const start = atBottomOnly ? Math.min(phoneStart(small), max) : 0;
      m = {
        start,
        max,
        top: Math.round(atBottomOnly ? small / 2 : TOP),
        bottom: Math.round(small - BOTTOM - BOX_HEIGHT * scale),
        showAt: atBottomOnly ? start : small * 0.6,
      };
      if (!scrollDriven) return;
      for (const t of tracks) {
        if (!t) continue;
        t.classList.add("is-scroll-driven");
        t.style.setProperty("--track-from", `${m.top}px`);
        t.style.setProperty("--track-to", `${m.bottom}px`);
        t.style.setProperty(
          "--track-steps",
          `${Math.max(2, m.bottom - m.top)}`,
        );
        t.style.setProperty("--range-start", `${m.start}px`);
        t.style.setProperty("--range-end", `${m.max}px`);
      }
    };

    const place = (scrollY: number) => {
      if (scrollDriven) return;
      const span = m.max - m.start;
      const progress =
        span > 0 ? Math.min(1, Math.max(0, (scrollY - m.start) / span)) : 1;
      const y = Math.round(m.top + progress * (m.bottom - m.top));
      for (const t of tracks) if (t) t.style.transform = `translateY(${y}px)`;
    };

    let shown: boolean | undefined;
    let moving = false;
    const onScroll = () => {
      const y = window.scrollY;
      place(y);
      const show = atBottomOnly ? y >= m.showAt : y > m.showAt;
      if (show !== shown) setVisible((shown = show));
      if (!moving) setWalking((moving = true));
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => setWalking((moving = false)), 180);
    };

    const onResize = () => {
      measure();
      place(window.scrollY);
      const y = window.scrollY;
      const show = atBottomOnly ? y >= m.showAt : y > m.showAt;
      if (show !== shown) setVisible((shown = show));
    };

    let stopTimer: ReturnType<typeof setTimeout> | undefined;
    onResize();
    const observer = new ResizeObserver(onResize);
    observer.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(stopTimer);
      observer.disconnect();
      probe.remove();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [scale, atBottomOnly]);

  const hit = useCallback(
    (shot: number) => {
      const current = enemyRef.current;
      if (!visibleRef.current) return;
      if (current.phase === "bursting" || current.phase === "gone") return;
      removeShot(shot);
      const hp = current.hp - 1;
      const next: EnemyState = {
        ...current,
        hp,
        phase: hp > 0 ? "hit" : "bursting",
        attacking: false,
      };
      enemyRef.current = next;
      setEnemy(next);
      if (hp > 0) {
        setTimeout(
          () =>
            setEnemy((e) => (e.phase === "hit" ? { ...e, phase: "alive" } : e)),
          HIT_MS,
        );
        return;
      }
      const { kind } = current;
      setBurst({
        kind,
        pieces: burstPieces(enemyPixels(kind), kind.width, kind.height),
      });
      slideInAfterBurst(
        () =>
          setEnemy((e) => ({
            kind: nextEnemy(e.kind),
            hp: ENEMY_HP,
            phase: "gone",
            attacking: false,
          })),
        () =>
          setEnemy((e) => (e.phase === "gone" ? { ...e, phase: "alive" } : e)),
      );
      setTimeout(() => setBurst(null), BURST_MS);
    },
    [removeShot, enemyRef, visibleRef],
  );

  const playerHit = useCallback(
    (shot: number) => {
      const current = playerRef.current;
      if (!visibleRef.current || current.phase !== "alive") return;
      removeShot(shot);
      const hp = current.hp - 1;
      const next = { hp, phase: (hp > 0 ? "alive" : "bursting") as Phase };
      playerRef.current = next;
      setPlayer(next);
      if (hp > 0) {
        setHurt(true);
        clearTimeout(hurtTimer.current);
        hurtTimer.current = setTimeout(() => setHurt(false), HURT_MS);
        return;
      }
      clearTimeout(hurtTimer.current);
      setHurt(false);
      const { src, frameWidth, frameHeight } = PLAYER_SPRITES.idle;
      setPlayerBurst(
        burstPieces(spritePixels(src, true), frameWidth, frameHeight),
      );
      slideInAfterBurst(
        () => setPlayer({ hp: PLAYER_HP, phase: "gone" }),
        () =>
          setPlayer((p) => (p.phase === "gone" ? { ...p, phase: "alive" } : p)),
        PLAYER_RESPAWN_MS,
      );
      setTimeout(() => setPlayerBurst(null), BURST_MS);
    },
    [removeShot, playerRef, visibleRef],
  );

  const trackY = () => trackRef.current?.getBoundingClientRect().top ?? 0;
  const playerLeft = atBottomOnly ? PHONE_EDGE : 2 * scale;
  const enemyRight = atBottomOnly ? PHONE_EDGE : 2 * scale;

  const shootBack = useCallback(
    (kind: EnemyState["kind"]) => {
      const current = enemyRef.current;
      if (current.kind !== kind || current.phase !== "alive") return;
      if (walkingRef.current) return;
      const vw = window.innerWidth;
      const x = vw - enemyRight - (kind.width + 2) * scale;
      const row =
        BOX_HEIGHT -
        (kind.lift ?? 0) -
        kind.height +
        (kind.sink ?? 0) +
        kind.muzzleTop;
      const y = trackY() + row * scale;
      const id = addShot({ from: "enemy", x, y, floor: FLOOR_ROW - row });
      const target = playerLeft + (BODY_WIDTH / 2) * scale;
      const delay = Math.max(0, ((x + scale - target) / vw) * BULLET_MS);
      setTimeout(() => {
        if (overlaps(y, 2 * scale, trackY(), BODY_HEIGHT * scale)) {
          playerHit(id);
        }
      }, delay);
    },
    [scale, enemyRight, playerLeft, addShot, playerHit, enemyRef, walkingRef],
  );

  const attackReady =
    visible &&
    !walking &&
    player.phase === "alive" &&
    enemy.phase === "alive" &&
    !enemy.attacking;
  useEffect(() => {
    if (!attackReady) return;
    const timer = setTimeout(() => {
      const { kind } = enemyRef.current;
      const { duration, shots } = attackTiming(kind);
      setEnemy((e) => ({ ...e, attacking: true }));
      setTimeout(
        () =>
          setEnemy((e) => (e.kind === kind ? { ...e, attacking: false } : e)),
        duration,
      );
      for (const at of shots) setTimeout(() => shootBack(kind), at);
    }, IDLE_CYCLES_PER_ATTACK * IDLE_CYCLE_MS);
    return () => clearTimeout(timer);
  }, [attackReady, shootBack, enemyRef]);

  const fire = () => {
    if (!visible || player.phase !== "alive") return;
    if (shoot() === null) return;
    const vw = window.innerWidth;
    const x = playerLeft + MUZZLE.right * scale;
    const y = trackY() + MUZZLE.top * scale;
    const id = addShot({ from: "player", x, y, floor: FLOOR_ROW - MUZZLE.top });
    const target = vw - enemyRight - (enemyRef.current.kind.width / 2) * scale;
    const delay = Math.max(0, ((target - x - scale / 2) / vw) * BULLET_MS);
    setTimeout(() => {
      const { kind } = enemyRef.current;
      const top =
        trackY() +
        (BOX_HEIGHT - (kind.lift ?? 0) - kind.height + (kind.sink ?? 0)) *
          scale;
      if (overlaps(y, scale, top, kind.height * scale)) hit(id);
    }, delay);
  };

  // On phones they sit behind the content, so taps are hit-tested here.
  const fireRef = useLatest(fire);
  useEffect(() => {
    if (!atBottomOnly) return;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) return;
      const r = trackRef.current
        ?.querySelector("button")
        ?.getBoundingClientRect();
      if (
        r &&
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      ) {
        fireRef.current();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [atBottomOnly, fireRef]);

  if (!scale) return null;

  const layer = atBottomOnly ? "z-[-1]" : "z-40";

  const enemyShown = visible && enemy.phase !== "gone";
  let enemyAnimation: EnemyAnimation = walking ? "walk" : "idle";
  if (enemy.attacking && !walking) enemyAnimation = "attack";
  if (enemy.phase === "hit") enemyAnimation = "hit";

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[-1]"
        aria-hidden="true"
      >
        {shots.map((shot) => {
          const size = (shot.from === "enemy" ? 2 : 1) * scale;
          return (
            <span
              key={shot.id}
              className={`absolute ${shot.from === "enemy" ? "enemy-bullet" : "pixel-bullet"}`}
              style={
                {
                  left: shot.x,
                  top: shot.y,
                  width: size,
                  height: size,
                  "--px": `${scale}px`,
                  "--floor": shot.floor,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>
      <div
        ref={trackRef}
        className={`companion-track pointer-events-none fixed top-0 ${layer}`}
        style={{ left: playerLeft }}
        aria-hidden="true"
      >
        {playerBurst && (
          <PixelBurst
            pieces={playerBurst}
            scale={scale}
            className="left-0 top-0"
          />
        )}
        <button
          type="button"
          tabIndex={-1}
          onClick={fire}
          className={`companion-drop cursor-pointer ${visible && player.phase !== "gone" ? "pointer-events-auto" : "is-hidden"} ${player.phase === "alive" ? "" : "is-snapped"}`}
        >
          <Player
            animation={walking ? "walk" : "idle"}
            flipX
            scale={scale}
            shooting={shooting}
            hurt={hurt}
          />
        </button>
      </div>
      <div
        ref={enemyTrackRef}
        className={`companion-track pointer-events-none fixed top-0 ${layer}`}
        style={{ right: enemyRight }}
        aria-hidden="true"
      >
        <div className="relative" style={{ height: BOX_HEIGHT * scale }}>
          {burst && (
            <PixelBurst
              pieces={burst.pieces}
              scale={scale}
              top={burst.kind.sink ?? 0}
              className="right-0"
              style={{
                bottom: (burst.kind.lift ?? 0) * scale,
                width: burst.kind.width * scale,
                height: burst.kind.height * scale,
              }}
            />
          )}
          <div
            className={`enemy-drop absolute right-0 ${enemyShown ? "" : "is-hidden"} ${enemy.phase === "bursting" || enemy.phase === "gone" ? "is-snapped" : ""}`}
            style={{ bottom: (enemy.kind.lift ?? 0) * scale }}
          >
            <Enemy
              key={enemy.kind.id}
              kind={enemy.kind}
              scale={scale}
              animation={enemyAnimation}
            />
          </div>
        </div>
      </div>
    </>
  );
}
