// Web Audio sound effects. Off by default; files load only once turned on.

type Sound = { file: string; volume: number; rate?: number; jitter?: number };

const SOUNDS = {
  shot: { file: "GunShot", volume: 0.3, jitter: 0.08 },
  enemyShot: { file: "GunShot", volume: 0.22, rate: 0.72, jitter: 0.08 },
  hit: { file: "HitBody", volume: 0.35, jitter: 0.1 },
  explode: { file: "Explosion", volume: 0.35, jitter: 0.1 },
  playerHit: { file: "PlayerHit", volume: 0.4, jitter: 0.08 },
  lose: { file: "Lose", volume: 0.4, jitter: 0 },
  spawn: { file: "Spawn", volume: 0.2 },
  spark: { file: "FootStep", volume: 0.15, rate: 1.6, jitter: 0.1 },
  ui: { file: "MenuSelect", volume: 0.35 },
  start: { file: "Start", volume: 0.35, jitter: 0 },
  coin: { file: "CoinPickUp", volume: 0.35 },
} satisfies Record<string, Sound>;

type SoundName = keyof typeof SOUNDS;

const STORAGE_KEY = "sound";
// Repeated sounds vary their pitch by up to this much so they never drone.
const DEFAULT_JITTER = 0.06;

let enabled = false;
let context: AudioContext | null = null;
const buffers = new Map<string, Promise<AudioBuffer | null>>();
const listeners = new Set<() => void>();

function load(file: string) {
  let buffer = buffers.get(file);
  if (!buffer && context) {
    const ctx = context;
    buffer = fetch(`/sfx/${file}.m4a`)
      .then((r) => r.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .catch(() => null);
    buffers.set(file, buffer);
  }
  return buffer;
}

function preloadAll() {
  for (const { file } of Object.values(SOUNDS)) load(file);
}

export function soundEnabled() {
  return enabled;
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Browsers only start audio inside a user gesture.
function unlock() {
  context ??= new AudioContext();
  void context.resume();
  preloadAll();
}

function notify() {
  for (const listener of listeners) listener();
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
  if (on) unlock();
  notify();
}

const GESTURES = ["pointerdown", "touchend", "click", "keydown"] as const;

/** Restores a saved "on"; audio starts with the first tap or key press. */
export function restoreSound() {
  try {
    if (localStorage.getItem(STORAGE_KEY) !== "on") return;
  } catch {
    return;
  }
  enabled = true;
  notify();
  const start = () => {
    for (const type of GESTURES) removeEventListener(type, start, true);
    if (enabled) unlock();
  };
  for (const type of GESTURES) addEventListener(type, start, true);
}

export function playSound(name: SoundName) {
  if (!enabled || !context) return;
  const ctx = context;
  if (ctx.state === "suspended") void ctx.resume();
  const sound: Sound = SOUNDS[name];
  void load(sound.file)?.then((buffer) => {
    if (!buffer || !enabled) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const jitter = sound.jitter ?? DEFAULT_JITTER;
    source.playbackRate.value =
      (sound.rate ?? 1) * (1 + (Math.random() * 2 - 1) * jitter);
    const gain = ctx.createGain();
    gain.gain.value = sound.volume;
    source.connect(gain).connect(ctx.destination);
    source.start();
  });
}
