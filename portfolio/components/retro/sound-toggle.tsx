"use client";

import { useEffect, useSyncExternalStore } from "react";
import { copy } from "@/lib/copy";
import {
  playSound,
  restoreSound,
  setSoundEnabled,
  soundEnabled,
  subscribeSound,
} from "@/lib/sound";
import { PixelIcon } from "@/components/retro/pixel-icon";
import { dropdown } from "@/components/retro/ui";

export function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, soundEnabled, () => false);

  useEffect(restoreSound, []);

  const toggle = () => {
    setSoundEnabled(!on);
    playSound("ui");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={copy.menu.sound}
      className={`${dropdown.trigger} px-3 text-body`}
    >
      <PixelIcon name={on ? "sound" : "mute"} />
    </button>
  );
}
