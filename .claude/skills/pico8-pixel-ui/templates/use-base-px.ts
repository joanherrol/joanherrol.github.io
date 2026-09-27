import { useSyncExternalStore } from "react";
import { basePx } from "@/lib/pixel";

function onResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

export function useBasePx() {
  return useSyncExternalStore(onResize, basePx, () => 0);
}
