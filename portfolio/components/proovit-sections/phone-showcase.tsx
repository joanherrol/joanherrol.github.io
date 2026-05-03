"use client";

import { useState, useRef, useCallback } from "react";
import { useLocale } from "@/lib/i18n";

type ShowcaseKey = "upload" | "ranking" | "friends" | "groups" | "profile";

const showcaseVideos: Record<ShowcaseKey, string> = {
  upload: "/proovit/upload-proovit.mp4",
  ranking: "/proovit/ranking.mp4",
  friends: "/proovit/search.mp4",
  groups: "/proovit/groups.mp4",
  profile: "/proovit/profile.mp4",
};

const showcaseOrder: ShowcaseKey[] = [
  "upload",
  "ranking",
  "friends",
  "groups",
  "profile",
];

export function PhoneShowcase() {
  const { t } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goTo = useCallback((idx: number) => {
    const next = (idx + showcaseOrder.length) % showcaseOrder.length;
    const el = videoRefs.current[next];
    if (el) {
      el.currentTime = 0;
      el.play();
    }
    setActiveIndex(next);
  }, []);

  const handleEnded = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % showcaseOrder.length;
      const el = videoRefs.current[next];
      if (el) {
        el.currentTime = 0;
        el.play();
      }
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[200px] sm:w-[230px] md:w-[260px] overflow-hidden rounded-[2rem]">
        {showcaseOrder.map((key, idx) => (
          <video
            key={key}
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            className={`pointer-events-none w-full h-full object-cover transition-opacity duration-500 ${
              idx === activeIndex
                ? "opacity-100 relative"
                : "opacity-0 absolute inset-0"
            }`}
            autoPlay={idx === 0}
            muted
            playsInline
            onEnded={idx === activeIndex ? handleEnded : undefined}
          >
            <source src={showcaseVideos[key]} type="video/mp4" />
          </video>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {showcaseOrder.map((key, idx) => (
          <button
            key={key}
            type="button"
            onClick={() => goTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? "w-8 bg-[#d50032]"
                : "w-3 bg-white/35 hover:bg-white/70"
            }`}
          ></button>
        ))}
      </div>

      <p className="text-xs text-white/50">
        {activeIndex + 1} / {showcaseOrder.length}
      </p>
    </div>
  );
}
