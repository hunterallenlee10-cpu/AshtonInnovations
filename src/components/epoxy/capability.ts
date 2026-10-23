"use client";

import { useSyncExternalStore } from "react";

/*
  Decides how the pour renders:
  - "webgl": desktop-class device, motion allowed -> three.js shader
  - "video": mobile, coarse pointer, low-power, Save-Data or no WebGL -> D1 loop
  - "still": prefers-reduced-motion -> stills only
  - "pending": server render / before hydration -> poster only
  A `?epoxy=webgl|video|still` query param forces a mode (for QA).
*/
export type PourMode = "pending" | "webgl" | "video" | "still";

const QUERIES = ["(prefers-reduced-motion: reduce)", "(pointer: coarse)", "(max-width: 767px)"];

let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const c = document.createElement("canvas");
    webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

function detect(): PourMode {
  const forced = new URLSearchParams(window.location.search).get("epoxy");
  if (forced === "webgl" || forced === "video" || forced === "still") return forced;

  const mq = (q: string) => window.matchMedia(q).matches;
  if (mq(QUERIES[0])) return "still";
  if (mq(QUERIES[1]) || mq(QUERIES[2])) return "video";
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if ((nav.hardwareConcurrency ?? 8) <= 4) return "video";
  if ((nav.deviceMemory ?? 8) <= 4) return "video";
  if (nav.connection?.saveData) return "video";
  if (!hasWebGL()) return "video";
  return "webgl";
}

function subscribe(cb: () => void) {
  const mqs = QUERIES.map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener("change", cb));
  return () => mqs.forEach((m) => m.removeEventListener("change", cb));
}

export function usePourMode(): PourMode {
  return useSyncExternalStore(subscribe, detect, () => "pending");
}
