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
  attackTiming,
  ENEMY_HP,
  Enemy,
  HIT_MS,
  IDLE_FRAME_MS,
  IDLE_FRAMES,
  nextEnemy,
  preloadEnemySprites,
  ENEMIES,
  type EnemyKind,
  type EnemyAnimation,
} from "@/components/retro/enemy";
import { artPx, devicePx } from "@/lib/pixel";
import { playSound } from "@/lib/sound";
import {
  FLASH_COLORS,
  flashPieces,
  PixelBurst,
  type BurstPiece,
} from "@/components/retro/pixel-burst";
import {
  firstHit,
  readCovers,
  spriteRects,
  type Rect,
} from "@/components/retro/collision";

// Character pixels in device pixels on phones, where there are no lanes.
const PHONE_SCALE = 4;
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
const IDLE_CYCLES_PER_ATTACK = 3;
const PLAYER_HP = 3;
const PLAYER_RESPAWN_MS = 2000;
// Solid palette flashes, since blending would leave the palette.
const HURT_FLASHES = [0, 140];
const FLASH_MS = 70;
const BOX_HEIGHT = 11;
const FLOOR_ROW = 9;
const PLAYER_SHADOW_TOP = 9;

// Rows to raise an enemy so its shadow top lines up with the player's.
function enemyLift(kind: EnemyKind) {
  return BOX_HEIGHT - PLAYER_SHADOW_TOP - kind.shadowHeight + kind.shadowTop;
}

// Shots keep their screen height: scrolling dodges them.
type Shot = {
  id: number;
  from: "player" | "enemy";
  x: number;
  y: number;
  floor: number;
};

const SPARK_MS = 250;

function sparkPieces(color: string, [nx, ny]: [number, number]): BurstPiece[] {
  return Array.from({ length: 6 }, (_, i) => {
    const along = 2 + Math.random() * 4;
    const across = (Math.random() - 0.5) * 8;
    return {
      x: 0,
      y: 0,
      color: i % 3 ? color : "#fff1e8",
      dx: Math.round(nx * along - ny * across),
      dy: Math.round(ny * along + nx * across),
    };
  });
}

type Pixel = { x: number; y: number; color: string };

// Reads the frame on screen, so a burst never waits on a download.
function canvasPixels(
  canvas: HTMLCanvasElement | null | undefined,
  width: number,
  height: number,
): Pixel[] {
  const ctx = canvas?.width ? canvas.getContext("2d") : null;
  if (!canvas || !ctx) return [];
  const block = canvas.width / width;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pixels: Pixel[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i =
        (Math.floor((y + 0.5) * block) * canvas.width +
          Math.floor((x + 0.5) * block)) *
        4;
      if (data[i + 3] < 128) continue;
      pixels.push({
        x,
        y,
        color: `rgb(${data[i]} ${data[i + 1]} ${data[i + 2]})`,
      });
    }
  }
  return pixels;
}

function burstPieces(
  pixels: Pixel[],
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

function hide(id: number) {
  for (const el of document.querySelectorAll<HTMLElement>(
    `[data-shot="${id}"]`,
  ))
    el.style.visibility = "hidden";
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

// Idle loops, then on to the idle frame closest to the attack's first frame.
function attackWait({ kind, idleFrom }: EnemyState) {
  const target = kind.attackFromIdle ?? 0;
  const frames =
    IDLE_CYCLES_PER_ATTACK * IDLE_FRAMES +
    ((target - idleFrom + IDLE_FRAMES) % IDLE_FRAMES);
  return frames * IDLE_FRAME_MS;
}

type EnemyState = {
  kind: (typeof ENEMIES)[number];
  hp: number;
  phase: Phase | "hit";
  attacking: boolean;
  idleFrom: number;
};

function enemyAnimationFor(
  enemy: EnemyState,
  walking: boolean,
): EnemyAnimation {
  if (enemy.phase === "hit") return "hit";
  if (walking) return "walk";
  return enemy.attacking ? "attack" : "idle";
}

export function PlayerCompanion() {
  const trackRef = useRef<HTMLDivElement>(null);
  const enemyTrackRef = useRef<HTMLDivElement>(null);
  const [walking, setWalking] = useState(false);
  const walkingRef = useLatest(walking);
  const [scale, setScale] = useState(0);
  const [atBottomOnly, setAtBottomOnly] = useState(false);
  const [edge, setEdge] = useState(0);
  const [safe, setSafe] = useState({ t: 0, r: 0, b: 0, l: 0 });
  const [visible, setVisible] = useState(false);
  const visibleRef = useLatest(visible);
  const { shooting, shoot } = useShoot();
  const [shots, setShots] = useState<Shot[]>([]);
  const nextShot = useRef(0);
  const live = useRef(new Map<number, Shot>());
  const removeShot = useCallback((id: number) => {
    live.current.delete(id);
    setShots((all) => all.filter((s) => s.id !== id));
  }, []);
  const [sparks, setSparks] = useState<
    { id: number; x: number; y: number; pieces: BurstPiece[]; look: string }[]
  >([]);
  const nextSpark = useRef(0);
  const addSpark = useCallback(
    (x: number, y: number, pieces: BurstPiece[], look = "is-spark") => {
      const id = nextSpark.current++;
      setSparks((all) => [...all, { id, x, y, pieces, look }]);
      setTimeout(
        () => setSparks((all) => all.filter((sp) => sp.id !== id)),
        SPARK_MS,
      );
      return id;
    },
    [],
  );
  const addShot = useCallback(
    (shot: Omit<Shot, "id">) => {
      const id = nextShot.current++;
      live.current.set(id, { ...shot, id });
      setShots((all) => [
        ...all,
        { ...shot, id, x: devicePx(shot.x), y: devicePx(shot.y) },
      ]);
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
    idleFrom: 0,
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
  }, []);
  const [hurt, setHurt] = useState(false);
  const hurtTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const flashHurt = useCallback((flashes: number[]) => {
    hurtTimers.current.forEach(clearTimeout);
    setHurt(false);
    hurtTimers.current = flashes.flatMap((at) => [
      setTimeout(() => setHurt(true), at),
      setTimeout(() => setHurt(false), at + FLASH_MS),
    ]);
  }, []);
  const enemyRef = useLatest(enemy);

  useEffect(() => {
    // iOS can resolve safe areas late, without a resize.
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;visibility:hidden;pointer-events:none;width:var(--edge);padding:var(--safe-t) var(--safe-r) var(--safe-b) var(--safe-l)";
    document.body.append(probe);
    const read = () => {
      const laneScale =
        Number(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--companion-scale",
          ),
        ) || 0;
      setAtBottomOnly(laneScale === 0);
      setScale((laneScale || PHONE_SCALE) * artPx());
      const cs = getComputedStyle(probe);
      setEdge(Number.parseFloat(cs.width));
      setSafe((s) => {
        const next = {
          t: Number.parseFloat(cs.paddingTop) || 0,
          r: Number.parseFloat(cs.paddingRight) || 0,
          b: Number.parseFloat(cs.paddingBottom) || 0,
          l: Number.parseFloat(cs.paddingLeft) || 0,
        };
        return Object.values(next).join() === Object.values(s).join()
          ? s
          : next;
      });
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(probe, { box: "border-box" });
    window.addEventListener("resize", read);
    return () => {
      observer.disconnect();
      probe.remove();
      window.removeEventListener("resize", read);
    };
  }, []);

  useEffect(() => {
    const scrollDriven = CSS.supports("animation-timeline", "scroll()");
    const tracks = [trackRef.current, enemyTrackRef.current];
    const step = artPx();
    const snap = (px: number) => Math.round(px / step) * step;
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
        top: snap(atBottomOnly ? small / 2 : TOP + safe.t),
        bottom: snap(small - BOTTOM - safe.b - BOX_HEIGHT * scale),
        showAt: atBottomOnly ? start : small * 0.6,
      };
      if (!scrollDriven) return;
      for (const t of tracks) {
        if (!t) continue;
        t.classList.add("is-scroll-driven");
        t.style.setProperty("--track-from", `${m.top}px`);
        t.style.setProperty("--track-to", `${m.bottom}px`);
        // jump-none: n steps make n - 1 moves of one art pixel each.
        t.style.setProperty(
          "--track-steps",
          `${Math.max(2, Math.round((m.bottom - m.top) / step) + 1)}`,
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
      const y = m.top + snap(progress * (m.bottom - m.top));
      for (const t of tracks) if (t) t.style.transform = `translateY(${y}px)`;
    };

    let shown: boolean | undefined;
    let moving = false;
    const setMoving = (value: boolean) => {
      moving = value;
      setWalking(value);
    };
    const reveal = (y: number) => {
      const show = atBottomOnly ? y >= m.showAt : y > m.showAt;
      if (show === shown) return;
      if (show && shown !== undefined) playSound("slide");
      shown = show;
      setVisible(show);
    };
    const onScroll = () => {
      const y = window.scrollY;
      place(y);
      reveal(y);
      if (!moving) {
        setMoving(true);
        setEnemy((e) => (e.idleFrom ? { ...e, idleFrom: 0 } : e));
      }
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => setMoving(false), 180);
    };

    const onResize = () => {
      measure();
      place(window.scrollY);
      reveal(window.scrollY);
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
  }, [scale, atBottomOnly, safe]);

  const damageEnemy = useCallback(
    (amount: number) => {
      const current = enemyRef.current;
      if (!visibleRef.current) return false;
      if (current.phase === "bursting" || current.phase === "gone")
        return false;
      const hp = Math.max(0, current.hp - amount);
      const next: EnemyState = {
        ...current,
        hp,
        phase: hp > 0 ? "hit" : "bursting",
        attacking: false,
        idleFrom: 0,
      };
      enemyRef.current = next;
      setEnemy(next);
      playSound(hp > 0 ? "hit" : "explode");
      if (hp > 0) {
        setTimeout(
          () =>
            setEnemy((e) => (e.phase === "hit" ? { ...e, phase: "alive" } : e)),
          HIT_MS,
        );
        return true;
      }
      const { kind } = current;
      setBurst({
        kind,
        pieces: burstPieces(
          canvasPixels(
            enemyTrackRef.current?.querySelector(
              ".enemy-drop canvas:last-child",
            ),
            kind.width,
            kind.height,
          ),
          kind.width,
          kind.height,
        ),
      });
      slideInAfterBurst(
        () =>
          setEnemy((e) => ({
            kind: nextEnemy(e.kind),
            hp: ENEMY_HP,
            phase: "gone",
            attacking: false,
            idleFrom: 0,
          })),
        () => {
          playSound("spawn");
          setEnemy((e) => (e.phase === "gone" ? { ...e, phase: "alive" } : e));
        },
      );
      setTimeout(() => setBurst(null), BURST_MS);
      return true;
    },
    [enemyRef, visibleRef],
  );
  const hit = useCallback(
    (shot: number) => live.current.has(shot) && damageEnemy(1),
    [damageEnemy],
  );
  const explode = () => damageEnemy(ENEMY_HP);

  const playerHit = useCallback(
    (shot: number) => {
      const current = playerRef.current;
      if (!live.current.has(shot)) return false;
      if (!visibleRef.current || current.phase !== "alive") return false;
      const hp = current.hp - 1;
      const next = { hp, phase: (hp > 0 ? "alive" : "bursting") as Phase };
      playerRef.current = next;
      setPlayer(next);
      if (hp > 0) playSound("playerHit");
      else {
        playSound("explode");
        playSound("lose");
      }
      if (hp > 0) {
        flashHurt(HURT_FLASHES);
        return true;
      }
      flashHurt([]);
      const { frameWidth, frameHeight } = PLAYER_SPRITES.idle;
      setPlayerBurst(
        burstPieces(
          canvasPixels(
            trackRef.current?.querySelector("button canvas.top-0"),
            frameWidth,
            frameHeight,
          ),
          frameWidth,
          frameHeight,
        ),
      );
      slideInAfterBurst(
        () => setPlayer({ hp: PLAYER_HP, phase: "gone" }),
        () => {
          playSound("slide");
          setPlayer((p) => (p.phase === "gone" ? { ...p, phase: "alive" } : p));
        },
        PLAYER_RESPAWN_MS,
      );
      setTimeout(() => setPlayerBurst(null), BURST_MS);
      return true;
    },
    [playerRef, visibleRef, flashHurt],
  );

  const trackY = () => trackRef.current?.getBoundingClientRect().top ?? 0;
  const playerLeft = edge + safe.l;
  const enemyRight = edge + safe.r;

  const shootBack = useCallback(
    (kind: EnemyState["kind"]) => {
      const current = enemyRef.current;
      if (current.kind !== kind || current.phase !== "alive") return;
      if (walkingRef.current) return;
      const sprite = enemyTrackRef.current
        ?.querySelector(".enemy-drop canvas:last-child")
        ?.getBoundingClientRect();
      if (!sprite) return;
      const x = Math.round(sprite.left + sprite.width / 2);
      const y = Math.round(sprite.top + kind.muzzleTop * scale);
      const row = (y - trackY()) / scale;
      const id = addShot({ from: "enemy", x, y, floor: FLOOR_ROW - row });
      playSound("enemyShot");
      addSpark(
        x,
        y + scale / 2,
        flashPieces(-1, FLASH_COLORS.enemy, id),
        "is-flash",
      );
    },
    [scale, addShot, addSpark, enemyRef, walkingRef],
  );

  // A bullet disappears on whatever it hits first; cover sparks off it.
  const advance = useCallback(
    (shot: Shot, covers: Rect[], last: Map<number, Rect>) => {
      const now = document
        .querySelector(`.shot:not(.shot-shadow)[data-shot="${shot.id}"]`)
        ?.getBoundingClientRect();
      if (!now) return;
      const enemyShot = shot.from === "enemy";
      const dir = enemyShot ? -1 : 1;
      const prev = last.get(shot.id) ?? {
        ...now.toJSON(),
        left: shot.x,
        right: shot.x + now.width,
      };
      last.set(shot.id, now);

      const target = enemyShot ? trackRef.current : enemyTrackRef.current;
      const struck = firstHit(prev, now, spriteRects(target), dir);
      const cover = firstHit(prev, now, covers, dir);
      const first = (a: { x: number }, b: { x: number }) =>
        dir > 0 ? a.x <= b.x : a.x >= b.x;
      if (struck && (!cover || first(struck, cover))) {
        if ((enemyShot ? playerHit : hit)(shot.id)) {
          hide(shot.id);
          removeShot(shot.id);
          return;
        }
      }
      if (!cover) return;
      hide(shot.id);
      removeShot(shot.id);
      playSound("spark");
      addSpark(
        cover.x + ((-dir - 1) * scale) / 2,
        now.top + now.height / 2 - scale / 2,
        sparkPieces(enemyShot ? "#ff004d" : "#fff1e8", [-dir, 0]),
      );
    },
    [hit, playerHit, removeShot, addSpark, scale],
  );

  const flying = shots.length > 0;
  useEffect(() => {
    if (!flying) return;
    let raf = 0;
    const last = new Map<number, Rect>();
    const tick = () => {
      const covers = readCovers();
      for (const shot of live.current.values()) advance(shot, covers, last);
      for (const id of last.keys()) if (!live.current.has(id)) last.delete(id);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [flying, advance]);

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
      const idleFrom = kind.idleAfterAttack ?? 0;
      setEnemy((e) => ({ ...e, attacking: true }));
      setTimeout(
        () =>
          setEnemy((e) =>
            e.kind === kind ? { ...e, attacking: false, idleFrom } : e,
          ),
        duration,
      );
      for (const at of shots) setTimeout(() => shootBack(kind), at);
    }, attackWait(enemyRef.current));
    return () => clearTimeout(timer);
  }, [attackReady, shootBack, enemyRef]);

  const fire = () => {
    if (!visible || player.phase !== "alive") return;
    if (shoot() === null) return;
    playSound("shot");
    const x = playerLeft + MUZZLE.right * scale;
    const y = trackY() + MUZZLE.top * scale;
    const id = addShot({ from: "player", x, y, floor: FLOOR_ROW - MUZZLE.top });
    addSpark(x, y, flashPieces(1, FLASH_COLORS.player, id), "is-flash");
  };

  // On phones they sit behind the content, so taps are hit-tested here.
  const tapRef = useLatest({ fire, explode });
  useEffect(() => {
    if (!atBottomOnly) return;
    const under = (e: MouseEvent, track: HTMLElement | null) => {
      const r = track?.querySelector("button")?.getBoundingClientRect();
      return (
        !!r &&
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      );
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) return;
      if (under(e, trackRef.current)) tapRef.current.fire();
      else if (under(e, enemyTrackRef.current)) tapRef.current.explode();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [atBottomOnly, tapRef]);

  if (!scale) return null;

  const layer = atBottomOnly ? "z-[-1]" : "z-40";

  const renderShot = (shot: Shot, part: "bullet" | "shadow") => {
    const size = (shot.from === "enemy" ? 2 : 1) * scale;
    const bullet = shot.from === "enemy" ? "enemy-bullet" : "player-bullet";
    const look = part === "shadow" ? "shot-shadow" : bullet;
    return (
      <span
        key={shot.id}
        data-shot={shot.id}
        className={`shot absolute ${look} ${shot.from === "enemy" ? "is-left" : ""}`}
        style={{
          left: shot.x,
          top: shot.y + (part === "shadow" ? shot.floor * scale : 0),
          width: size,
          height: size,
        }}
      />
    );
  };

  const enemyShown = visible && enemy.phase !== "gone";
  const enemyAnimation = enemyAnimationFor(enemy, walking);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[-1]"
        aria-hidden="true"
      >
        {shots.map((shot) => renderShot(shot, "shadow"))}
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
                bottom: enemyLift(burst.kind) * scale,
                width: burst.kind.width * scale,
                height: burst.kind.height * scale,
              }}
            />
          )}
          <button
            type="button"
            tabIndex={-1}
            onClick={explode}
            className={`enemy-drop absolute right-0 cursor-pointer ${enemyShown ? "pointer-events-auto" : "is-hidden"} ${enemy.phase === "bursting" || enemy.phase === "gone" ? "is-snapped" : ""}`}
            style={{ bottom: enemyLift(enemy.kind) * scale }}
          >
            <Enemy
              key={enemy.kind.id}
              kind={enemy.kind}
              scale={scale}
              animation={enemyAnimation}
              startFrame={enemyAnimation === "idle" ? enemy.idleFrom : 0}
            />
          </button>
        </div>
      </div>
      {/* Over the enemy, under the content; on desktop via a lane-clipped copy. */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1]"
        aria-hidden="true"
      >
        {shots.map((shot) => renderShot(shot, "bullet"))}
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-40"
        aria-hidden="true"
      >
        {sparks.map((sp) => (
          <PixelBurst
            key={sp.id}
            pieces={sp.pieces}
            scale={scale}
            className={sp.look}
            style={{ left: sp.x, top: sp.y }}
          />
        ))}
      </div>
      {!atBottomOnly && (
        <div
          className="pointer-events-none fixed inset-0 z-40 [clip-path:inset(0_0_0_calc(100%-var(--lane)))]"
          aria-hidden="true"
        >
          {shots.map((shot) => renderShot(shot, "bullet"))}
        </div>
      )}
    </>
  );
}
