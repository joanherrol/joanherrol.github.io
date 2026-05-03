"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n";
import { ParticlesBackground } from "@/components/shared/particles-background";
import { GalleryLightbox } from "@/components/shared/gallery-lightbox";

const paintings = [
  {
    src: "/imgs/paintings/TraditionalPortrait.jpg",
    titleKey: "traditionalPortraitTitle" as const,
    descKey: "traditionalPortraitDesc" as const,
  },
  {
    src: "/imgs/paintings/Party.png",
    titleKey: "partyTitle" as const,
    descKey: "partyDesc" as const,
  },
  {
    src: "/imgs/paintings/Despair.png",
    titleKey: "despairTitle" as const,
    descKey: "despairDesc" as const,
  },
  {
    src: "/imgs/paintings/ForestPortrait.png",
    titleKey: "forestPortraitTitle" as const,
    descKey: "forestPortraitDesc" as const,
  },
  {
    src: "/imgs/paintings/Dragon.jpg",
    titleKey: "dragonTitle" as const,
    descKey: "dragonDesc" as const,
  },
  {
    src: "/imgs/paintings/Totoro.jpg",
    titleKey: "totoroTitle" as const,
    descKey: "totoroDesc" as const,
  },
  {
    src: "/imgs/paintings/FlowerPortrait.png",
    titleKey: "flowerPortraitTitle" as const,
    descKey: "flowerPortraitDesc" as const,
  },
  {
    src: "/imgs/paintings/BeachPortrait.png",
    titleKey: "beachPortraitTitle" as const,
    descKey: "beachPortraitDesc" as const,
  },
  {
    src: "/imgs/paintings/JoyfulPortrait.png",
    titleKey: "joyfulPortraitTitle" as const,
    descKey: "joyfulPortraitDesc" as const,
  },
  {
    src: "/imgs/paintings/DoublePortrait.png",
    titleKey: "doublePortraitTitle" as const,
    descKey: "doublePortraitDesc" as const,
  },
  {
    src: "/imgs/paintings/MulticolourPortrait.png",
    titleKey: "multicolourPortraitTitle" as const,
    descKey: "multicolourPortraitDesc" as const,
  },
  {
    src: "/imgs/paintings/BouguereauMasterStudy.png",
    titleKey: "bouguereauTitle" as const,
    descKey: "bouguereauDesc" as const,
  },
];

export function Gallery() {
  const { t } = useLocale();

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());

  const openLightbox = useCallback((index: number) => {
    if (window.innerWidth < 640) return;
    setLightbox(index);
  }, []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () =>
      setLightbox((i) =>
        i === null ? null : (i - 1 + paintings.length) % paintings.length,
      ),
    [],
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % paintings.length)),
    [],
  );

  return (
    <section
      id="gallery"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      <ParticlesBackground />
      <div className="max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col pt-32 pb-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground">
            {t.gallery.heading}
          </h1>
          <p className="text-muted-foreground mt-2">{t.gallery.subheading}</p>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {paintings.map((p, i) => (
            <div
              key={p.src}
              className="break-inside-avoid group relative cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <div className="relative w-full overflow-hidden rounded-xl shadow-md bg-muted">
                {!loaded.has(i) && (
                  <div
                    className="absolute inset-0 animate-pulse bg-muted rounded-xl"
                    style={{ aspectRatio: "3/4" }}
                  />
                )}
                <Image
                  src={p.src}
                  alt={t.gallery[p.titleKey]}
                  width={600}
                  height={800}
                  className={`w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 ${
                    loaded.has(i) ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="eager"
                  onLoad={() => setLoaded((prev) => new Set(prev).add(i))}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                  <h3 className="text-white font-semibold text-base leading-tight">
                    {t.gallery[p.titleKey]}
                  </h3>
                  <p className="text-white/80 text-sm mt-1 line-clamp-2">
                    {t.gallery[p.descKey]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <GalleryLightbox
          src={paintings[lightbox].src}
          title={t.gallery[paintings[lightbox].titleKey]}
          desc={t.gallery[paintings[lightbox].descKey]}
          index={lightbox}
          total={paintings.length}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}
