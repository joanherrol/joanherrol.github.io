"use client";

import Lottie from "lottie-react";
import { Outfit } from "next/font/google";
import { useLocale } from "@/lib/i18n";
import coin from "@/components/lotties/coin.json";
import confetti from "@/components/lotties/confetti.json";
import infinityLoad from "@/components/lotties/infinityLoad.json";
import robotAccepted from "@/components/lotties/robotAccepted.json";
import robotInProgress from "@/components/lotties/robotInProgress.json";
import robotRejected from "@/components/lotties/robotRejected.json";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const colorSwatches = [
  { varName: "--background", color: "#000000" },
  { varName: "--surface", color: "#141516" },
  { varName: "--accent", color: "#d50032" },
  { varName: "--text", color: "#fdfdfd" },
];

const motionAssets = [
  { id: "coin", data: coin, className: "h-16 w-16" },
  { id: "confetti", data: confetti, className: "h-20 w-20" },
  {
    id: "infinity",
    data: infinityLoad,
    className: "h-16 w-16",
  },
  {
    id: "robot-accepted",
    data: robotAccepted,
    className: "h-24 w-24",
  },
  {
    id: "robot-progress",
    data: robotInProgress,
    className: "h-24 w-24",
  },
  {
    id: "robot-rejected",
    data: robotRejected,
    className: "h-24 w-24",
  },
];

export function DesignSection() {
  const { t } = useLocale();

  return (
    <section id="design" className="h-screen flex flex-col overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 w-full h-full flex flex-col pt-24 pb-10 overflow-y-auto">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
          {t.proovit.navSections.design}
        </p>

        <div className="flex-1 flex flex-col justify-center gap-8">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {t.proovit.design.description}
          </p>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <article className="rounded-2xl border border-border bg-muted/20 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t.proovit.design.fontTitle}
              </p>
              <p className={`${outfit.className} mt-4 text-4xl font-semibold`}>
                {t.proovit.design.fontSample}
              </p>
              <p className={`${outfit.className} mt-3 text-xl`}>
                Lorem ipsum dolor sit amet
              </p>
              <p className={`${outfit.className} mt-3 text-sm leading-relaxed`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                posuere erat a ante venenatis dapibus posuere velit aliquet.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {t.proovit.design.fontDescription}
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-muted/20 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t.proovit.design.paletteTitle}
              </p>
              <div className="mt-4 space-y-3">
                {colorSwatches.map((swatch) => (
                  <div
                    key={swatch.varName}
                    className="flex items-center gap-3 rounded-lg bg-background/60 px-3 py-2"
                  >
                    <div
                      className="h-7 w-7 rounded-md border border-border"
                      style={{ backgroundColor: swatch.color }}
                    />
                    <p className="text-xs font-semibold">{swatch.varName}</p>
                    <p className="ml-auto text-xs text-muted-foreground">
                      {swatch.color}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div>
            <article className="rounded-2xl border border-border bg-muted/20 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t.proovit.design.animationsTitle}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
                {motionAssets.map((asset) => (
                  <div key={asset.id} className="px-1">
                    <div className="flex h-20 items-center justify-center">
                      <Lottie
                        animationData={asset.data}
                        loop
                        autoplay
                        className={asset.className}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
