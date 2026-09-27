"use client";

import { useCallback, useEffect, useState } from "react";

// Tokens set as whole multiples of one device-aligned pixel (--ipx).
const TOKENS = [
  { name: "--p", label: "Base pixel P" },
  ...["display", "headline", "title", "body", "label"].flatMap((style) =>
    ["lg", "md", "sm"].map((size) => ({
      name: `--fp-${style}-${size}`,
      label: `${style} ${size}`,
    })),
  ),
];

type Values = Record<string, number>;

function ipx() {
  const root = document.documentElement;
  return Number.parseFloat(root.style.getPropertyValue("--ipx")) || 1;
}

// Each token's current multiple, whatever form it is written in.
function read(): Values {
  const style = getComputedStyle(document.documentElement);
  const values: Values = {};
  for (const { name } of TOKENS) {
    const raw = style.getPropertyValue(name).trim();
    const factor = /\*\s*([\d.]+)\s*\)/.exec(raw);
    values[name] = factor
      ? Number(factor[1])
      : Math.round(Number.parseFloat(raw) / ipx());
  }
  return values;
}

// Fills in measured sizes and colours, so the sheet shows real values.
function measure() {
  for (const el of document.querySelectorAll<HTMLElement>("[data-measure]")) {
    const target = document.getElementById(el.dataset.measure ?? "");
    if (!target) continue;
    const size = Number.parseFloat(getComputedStyle(target).fontSize);
    el.textContent = `${size}px · pixel ${size / 8}px`;
  }
  for (const el of document.querySelectorAll<HTMLElement>("[data-hex]")) {
    const rgb = getComputedStyle(el).backgroundColor.match(/\d+/g) ?? [];
    const hex = rgb
      .slice(0, 3)
      .map((c) => Number(c).toString(16).padStart(2, "0"))
      .join("");
    const out = el.parentElement?.querySelector("[data-hex-out]");
    if (out) out.textContent = `#${hex}`;
  }
  for (const el of document.querySelectorAll<HTMLElement>("[data-width]")) {
    el.textContent = `${el.previousElementSibling?.getBoundingClientRect().width ?? 0}px`;
  }
}

export function Tuner() {
  const [values, setValues] = useState<Values>({});
  const [changed, setChanged] = useState<Values>({});
  const [phone, setPhone] = useState(false);

  const refresh = useCallback(() => {
    setValues(read());
    setPhone(window.matchMedia("(width < 40rem)").matches);
    requestAnimationFrame(measure);
  }, []);

  useEffect(() => {
    const first = requestAnimationFrame(refresh);
    document.fonts.ready.then(refresh);
    window.addEventListener("resize", refresh);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("resize", refresh);
    };
  }, [refresh]);

  const set = (name: string, n: number) => {
    document.documentElement.style.setProperty(name, `calc(var(--ipx) * ${n})`);
    setChanged((c) => ({ ...c, [name]: n }));
    refresh();
  };

  const reset = () => {
    for (const { name } of TOKENS)
      document.documentElement.style.removeProperty(name);
    setChanged({});
    refresh();
  };

  const snippet = Object.entries(changed)
    .map(([name, n]) => `${name}: calc(var(--ipx) * ${n});`)
    .join("\n");

  return (
    <aside className="card-cream pixel-float flex flex-col gap-4 p-6 text-body">
      <p className="text-body uppercase tracking-[0.25em]">
        Tuning {phone ? "phone (under 40rem)" : "desktop (40rem and up)"}
      </p>
      <p className="text-dark-grey">
        Whole device pixels per glyph pixel. Changes preview here only; send me
        the snippet to keep them.
      </p>
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2">
        {TOKENS.map(({ name, label }) => (
          <label key={name} className="contents">
            <span className="capitalize">{label}</span>
            <input
              type="number"
              min={1}
              max={24}
              value={values[name] ?? ""}
              onChange={(e) => set(name, Number(e.target.value))}
              className="w-20 bg-light-grey px-2 text-right text-black"
            />
          </label>
        ))}
      </div>
      {snippet && (
        <>
          <textarea
            readOnly
            wrap="off"
            value={snippet}
            rows={Object.keys(changed).length}
            className="w-full resize-none bg-light-grey p-2 text-black"
          />
          <button
            type="button"
            onClick={reset}
            className="card-accent pixel-float pixel-button self-start px-6 py-4 uppercase tracking-[0.125em]"
          >
            Reset
          </button>
        </>
      )}
    </aside>
  );
}
