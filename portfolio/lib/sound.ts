// Web Audio sound effects. Off by default; files load only once turned on.

// Loudness of each file's loud part in dBFS, so levels below compare fairly.
const LOUDNESS = {
  GunShot: -8,
  HitBody: -16.8,
  BloodExplosion: -16.6,
  PlayerHit: -10.8,
  Lose: -24,
  Spawn: -12.8,
  Dash: -16.5,
  Slam: -12.5,
  MenuSelect: -12,
  Start: -20,
  CoinPickUp: -7.9,
};

type Sound = {
  file: keyof typeof LOUDNESS;
  /** Target loudness in dB. */
  level: number;
  rate?: number;
  jitter?: number;
};

// Pitches follow the original game.
const SOUNDS = {
  shot: { file: "GunShot", level: -40, rate: 0.85, jitter: 0.06 },
  enemyShot: { file: "GunShot", level: -42, rate: 1.6, jitter: 0.06 },
  hit: { file: "HitBody", level: -38, rate: 1.1, jitter: 0.09 },
  explode: { file: "BloodExplosion", level: -34 },
  playerHit: { file: "PlayerHit", level: -36, rate: 1.25, jitter: 0.2 },
  lose: { file: "Lose", level: -36, jitter: 0 },
  spawn: { file: "Spawn", level: -40 },
  slide: { file: "Dash", level: -40, jitter: 0.1 },
  spark: { file: "Slam", level: -40, rate: 7.1, jitter: 0.015 },
  ui: { file: "MenuSelect", level: -38 },
  start: { file: "Start", level: -36, jitter: 0 },
  coin: { file: "CoinPickUp", level: -38 },
} satisfies Record<string, Sound>;

type SoundName = keyof typeof SOUNDS;

const STORAGE_KEY = "sound";
// Pitch variation, so repeated sounds never drone.
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

/** Clicking anything with data-sound plays the sound it names. */
export function listenForSoundClicks() {
  const onClick = (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>(
      "[data-sound]",
    );
    // Phones open downloads at once, so the sound would play on return.
    if (el?.matches("a[download]") && matchMedia("(pointer: coarse)").matches)
      return;
    const name = el?.dataset.sound;
    if (name && name in SOUNDS) playSound(name as SoundName);
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

export function playSound(name: SoundName) {
  if (!enabled || !context) return;
  const sound: Sound = SOUNDS[name];
  const ctx = context;
  if (ctx.state === "suspended") void ctx.resume();
  void load(sound.file)?.then((buffer) => {
    if (!buffer || !enabled) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const jitter = sound.jitter ?? DEFAULT_JITTER;
    source.playbackRate.value =
      (sound.rate ?? 1) * (1 + (Math.random() * 2 - 1) * jitter);
    const gain = ctx.createGain();
    gain.gain.value = 10 ** ((sound.level - LOUDNESS[sound.file]) / 20);
    source.connect(gain).connect(ctx.destination);
    source.start();
  });
}
