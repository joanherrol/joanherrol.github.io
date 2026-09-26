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
const HURT_MS = 300;
const BODY_WIDTH = 8;
const BODY_HEIGHT = 10;
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

// Page elements that stop bullets; titles block with their glyphs only.
const COVER = ".card-cream, .card-accent, main figure";
const TITLES = "main h1, main h2";
const SPARK_MS = 250;

type Cover = { key: string; rect: DOMRect };

function onScreen(rect: DOMRect) {
  return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
}

function coverRects(): Cover[] {
  const covers: Cover[] = [];
  document.querySelectorAll(COVER).forEach((el, i) => {
    covers.push({ key: `c${i}`, rect: el.getBoundingClientRect() });
  });
  const range = document.createRange();
  document.querySelectorAll(TITLES).forEach((title, i) => {
    if (!onScreen(title.getBoundingClientRect())) return;
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    for (let n = 0, node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.parentElement?.closest("button")) continue;
      range.selectNodeContents(node);
      for (const rect of range.getClientRects())
        covers.push({ key: `t${i}.${n++}`, rect });
    }
  });
  return covers.filter((c) => onScreen(c.rect));
}

type Box = { x: number; y: number; size: number };
type Target = { left: number; top: number; width: number; height: number };

// The cover a bullet flying in `dir` reaches within `lead` pixels.
function findCover(covers: Cover[], box: Box, dir: number, lead: number) {
  const left = dir > 0 ? box.x : box.x - lead;
  const right = box.x + box.size + (dir > 0 ? lead : 0);
  return covers.find(
    ({ rect: r }) =>
      right > r.left &&
      left < r.right &&
      box.y + box.size > r.top &&
      box.y < r.bottom,
  );
}

// Characters are hit a third of the way in from the side the bullet comes.
function crosses(box: Box, dir: number, lead: number, target?: Target) {
  if (!target?.width) return false;
  if (!overlaps(box.y, box.size, target.top, target.height)) return false;
  const right = target.left + target.width;
  if (dir > 0) {
    return (
      box.x + box.size + lead >= target.left + target.width / 3 && box.x < right
    );
  }
  return (
    box.x - lead <= target.left + (target.width * 2) / 3 &&
    box.x + box.size > target.left
  );
}

// The struck face is the one the bullet crossed last this frame.
function hitNormal(
  box: { x: number; y: number; size: number },
  prev: { x: number; y: number } | undefined,
  rect: DOMRect,
  before: DOMRect | undefined,
  dir: number,
): [number, number] {
  if (!prev || !before) return [-dir, 0];
  const entry = (gapBefore: number, gapNow: number) =>
    gapBefore > 0 ? gapBefore / (gapBefore - gapNow) : -1;
  const left = entry(
    before.left - prev.x - box.size,
    rect.left - box.x - box.size,
  );
  const right = entry(prev.x - before.right, box.x - rect.right);
  const top = entry(
    before.top - prev.y - box.size,
    rect.top - box.y - box.size,
  );
  const bottom = entry(prev.y - before.bottom, box.y - rect.bottom);
  const across = Math.max(left, right);
  if (Math.max(top, bottom) > across) return top > bottom ? [0, -1] : [0, 1];
  if (across < 0) return [-dir, 0];
  return left > right ? [-1, 0] : [1, 0];
}

// Centred on the bullet, just outside the face it struck.
function sparkOrigin(
  box: { x: number; y: number; size: number },
  rect: DOMRect,
  [nx, ny]: [number, number],
  scale: number,
) {
  const clamp = (v: number, lo: number, hi: number) =>
    Math.min(Math.max(v, lo), hi);
  const middle = (box.size - scale) / 2;
  let x = clamp(box.x + middle, rect.left, rect.right - scale);
  let y = clamp(box.y + middle, rect.top, rect.bottom - scale);
  if (nx) x = nx < 0 ? rect.left - scale : rect.right;
  if (ny) y = ny < 0 ? rect.top - scale : rect.bottom;
  return { x, y };
}

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

function overlaps(top: number, height: number, top2: number, height2: number) {
  return top < top2 + height2 && top2 < top + height;
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
  const [visible, setVisible] = useState(false);
  const visibleRef = useLatest(visible);
  const { shooting, shoot } = useShoot();
  const [shots, setShots] = useState<Shot[]>([]);
  const nextShot = useRef(0);
  const live = useRef(new Map<number, Shot & { vw: number }>());
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
      live.current.set(id, {
        ...shot,
        id,
        vw: window.innerWidth,
      });
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
      setScale(devicePx(laneScale || PHONE_SCALE));
      // Same inset as the corner menus.
      const probe = document.createElement("div");
      probe.style.cssText = "position:fixed;width:calc(var(--grid) * 3)";
      document.body.append(probe);
      setEdge(probe.getBoundingClientRect().width);
      probe.remove();
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
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
        top: snap(atBottomOnly ? small / 2 : TOP),
        bottom: snap(small - BOTTOM - BOX_HEIGHT * scale),
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
  }, [scale, atBottomOnly]);

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
    (shot: number) => {
      if (live.current.has(shot) && damageEnemy(1)) removeShot(shot);
    },
    [damageEnemy, removeShot],
  );
  const explode = () => damageEnemy(ENEMY_HP);

  const playerHit = useCallback(
    (shot: number) => {
      const current = playerRef.current;
      if (!live.current.has(shot)) return;
      if (!visibleRef.current || current.phase !== "alive") return;
      removeShot(shot);
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
        setHurt(true);
        clearTimeout(hurtTimer.current);
        hurtTimer.current = setTimeout(() => setHurt(false), HURT_MS);
        return;
      }
      clearTimeout(hurtTimer.current);
      setHurt(false);
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
    },
    [removeShot, playerRef, visibleRef],
  );

  const trackY = () => trackRef.current?.getBoundingClientRect().top ?? 0;
  const playerLeft = edge;
  const enemyRight = edge;
  // Slow phone bullets are already a pixel out by their first frame.
  const muzzleBack = atBottomOnly ? scale : 0;

  const shootBack = useCallback(
    (kind: EnemyState["kind"]) => {
      const current = enemyRef.current;
      if (current.kind !== kind || current.phase !== "alive") return;
      if (walkingRef.current) return;
      const sprite = enemyTrackRef.current
        ?.querySelector(".enemy-drop canvas:last-child")
        ?.getBoundingClientRect();
      if (!sprite) return;
      const x = Math.round(sprite.left + sprite.width / 2 - scale + muzzleBack);
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
    [scale, muzzleBack, addShot, addSpark, enemyRef, walkingRef],
  );

  const playerBody = useCallback((): Target | undefined => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return undefined;
    return {
      left: r.left,
      top: r.top,
      width: BODY_WIDTH * scale,
      height: BODY_HEIGHT * scale,
    };
  }, [scale]);
  const enemyBody = useCallback(
    () =>
      enemyTrackRef.current
        ?.querySelector(".enemy-drop canvas:last-child")
        ?.getBoundingClientRect(),
    [],
  );
  // A bullet stopped by cover sparks off the face it struck.
  const block = useCallback(
    (
      shot: Shot,
      box: Box,
      prev: Box | undefined,
      cover: Cover,
      coverBefore: DOMRect | undefined,
    ) => {
      removeShot(shot.id);
      const dir = shot.from === "enemy" ? -1 : 1;
      const normal = hitNormal(box, prev, cover.rect, coverBefore, dir);
      const at = sparkOrigin(box, cover.rect, normal, scale);
      playSound("spark");
      addSpark(
        at.x,
        at.y,
        sparkPieces(shot.from === "enemy" ? "#ff004d" : "#fff1e8", normal),
      );
    },
    [removeShot, addSpark, scale],
  );

  // Moves one bullet's collision state on by a frame of `dt` ms.
  const advance = useCallback(
    (
      shot: Shot & { vw: number },
      dt: number,
      covers: Cover[],
      last: Map<number, Box>,
      before: Map<string, DOMRect>,
    ) => {
      const rect = document
        .querySelector(`[data-shot="${shot.id}"]`)
        ?.getBoundingClientRect();
      if (!rect) return;
      const enemyShot = shot.from === "enemy";
      const dir = enemyShot ? -1 : 1;
      const box = { x: rect.left, y: rect.top, size: rect.width };
      const lead = ((shot.vw / BULLET_MS) * dt) / 2;
      const prev = last.get(shot.id);
      last.set(shot.id, box);
      const cover = findCover(covers, box, dir, lead);
      if (cover) {
        block(shot, box, prev, cover, before.get(cover.key));
      } else if (
        crosses(box, dir, lead, enemyShot ? playerBody() : enemyBody())
      ) {
        (enemyShot ? playerHit : hit)(shot.id);
      }
    },
    [block, playerBody, enemyBody, hit, playerHit],
  );

  // While bullets fly, test their on-screen boxes half a frame ahead.
  const flying = shots.length > 0;
  useEffect(() => {
    if (!flying) return;
    let raf = 0;
    let lastT = 0;
    let before = new Map<string, DOMRect>();
    const last = new Map<number, Box>();
    const tick = (t: number) => {
      const dt = lastT ? Math.min(t - lastT, 50) : 16;
      lastT = t;
      const covers = coverRects();
      for (const shot of live.current.values()) {
        advance(shot, dt, covers, last, before);
      }
      for (const id of last.keys()) if (!live.current.has(id)) last.delete(id);
      before = new Map(covers.map((c) => [c.key, c.rect]));
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
    const x = playerLeft + MUZZLE.right * scale - muzzleBack;
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

  const renderShot = (
    shot: Shot,
    part: "bullet" | "shadow",
    tracked = false,
  ) => {
    const size = (shot.from === "enemy" ? 2 : 1) * scale;
    const bullet = shot.from === "enemy" ? "enemy-bullet" : "player-bullet";
    const look = part === "shadow" ? "shot-shadow" : bullet;
    return (
      <span
        key={shot.id}
        data-shot={tracked ? shot.id : undefined}
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
        {shots.map((shot) => renderShot(shot, "bullet", true))}
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
