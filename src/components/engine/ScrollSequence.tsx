"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";

/*
  Canvas frame-sequence engine for the ceiling hero.

  - Reads frame counts from /frames/manifest.json (never hard-coded).
  - Preloads Image objects progressively: every 16th frame first, then 8th,
    4th, 2nd, then the rest, so the whole scroll range is usable early.
  - Eased scrub: the drawn frame chases the scroll target with a lerp.
  - Cover fit, devicePixelRatio capped at 2, portrait set on portrait screens.
  - Never scrubs a <video>. Skips drawing while off-screen.
  - Waits for the page to finish loading (or the first scroll/touch) before
    downloading frames, so the sequence never competes with first paint.
    A poster is painted on the canvas until the first frames land.
*/

type FrameSet = {
  count: number;
  width: number;
  height: number;
  path: string;
  ext: string;
  pad: number;
};

type Manifest = { desktop: FrameSet; mobile: FrameSet };

export type SequenceHandle = {
  /** 0..1 position in the sequence */
  setProgress: (p: number) => void;
};

export const PORTRAIT_QUERY = "(max-aspect-ratio: 4/5)";

type Props = {
  manifestUrl?: string;
  /** Drawn on the canvas until real frames arrive. */
  posterSrc?: string;
  posterSrcPortrait?: string;
  ariaLabel: string;
  className?: string;
  /** Called once when the first frame has been drawn. */
  onReady?: () => void;
};

export const ScrollSequence = forwardRef<SequenceHandle, Props>(function ScrollSequence(
  { manifestUrl = "/frames/manifest.json", posterSrc, posterSrcPortrait, ariaLabel, className = "", onReady },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef(0);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useImperativeHandle(
    ref,
    () => ({
      setProgress: (p: number) => {
        target.current = Math.min(1, Math.max(0, p));
      },
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let disposed = false;
    let set: FrameSet | null = null;
    let imgs: HTMLImageElement[] = [];
    let ready = new Uint8Array(0);
    let order: number[] = [];
    let cursor = 0;
    let inFlight = 0;
    let current = target.current;
    let lastDrawn = -1;
    let dirty = true;
    let visible = true;
    let announced = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const portrait = window.matchMedia(PORTRAIT_QUERY).matches;

    let poster: HTMLImageElement | null = null;
    let posterReady = false;

    const src = (i: number) => `${set!.path}${String(i + 1).padStart(set!.pad, "0")}${set!.ext}`;

    const pump = () => {
      while (!disposed && set && inFlight < 6 && cursor < order.length) {
        const i = order[cursor++];
        const im = new Image();
        im.decoding = "async";
        inFlight++;
        im.onload = () => {
          inFlight--;
          ready[i] = 1;
          // Repaint if this frame is near what we're showing.
          if (Math.abs(i - Math.round(current * (set!.count - 1))) < 24) dirty = true;
          pump();
        };
        im.onerror = () => {
          inFlight--;
          pump();
        };
        im.src = src(i);
        imgs[i] = im;
      }
    };

    const nearestReady = (i: number) => {
      if (!set) return null;
      for (let d = 0; d < set.count; d++) {
        if (i - d >= 0 && ready[i - d]) return imgs[i - d];
        if (i + d < set.count && ready[i + d]) return imgs[i + d];
      }
      return null;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        dirty = true;
      }
    };

    const draw = (im: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
      const w = im.naturalWidth * s;
      const h = im.naturalHeight * s;
      ctx.fillStyle = "#141414";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const tick = () => {
      if (!visible) return;
      if (!set) {
        if (posterReady && poster && dirty) {
          draw(poster);
          dirty = false;
        }
        return;
      }
      current = reduce ? target.current : current + (target.current - current) * 0.14;
      if (Math.abs(target.current - current) < 0.0004) current = target.current;
      const f = Math.round(current * (set.count - 1));
      if (f !== lastDrawn || dirty) {
        const im = ready[f] ? imgs[f] : (nearestReady(f) ?? (posterReady ? poster : null));
        if (im) {
          draw(im);
          lastDrawn = ready[f] ? f : -1;
          dirty = false;
          if (!announced) {
            announced = true;
            onReadyRef.current?.();
          }
        }
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) dirty = true;
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    let started = false;
    const begin = () => {
      if (started || disposed) return;
      started = true;
      cleanupTriggers();
      const pSrc = portrait ? (posterSrcPortrait ?? posterSrc) : posterSrc;
      if (pSrc) {
        poster = new Image();
        poster.decoding = "async";
        poster.onload = () => {
          posterReady = true;
          dirty = true;
        };
        poster.src = pSrc;
      }
      fetch(manifestUrl)
        .then((r) => r.json() as Promise<Manifest>)
        .then((m) => {
          if (disposed) return;
          set = portrait ? m.mobile : m.desktop;
          imgs = new Array(set.count);
          ready = new Uint8Array(set.count);
          const seen = new Set<number>();
          // Start where the visitor is, then coarse-to-fine across the range.
          const start = Math.round(target.current * (set.count - 1));
          order = [start];
          seen.add(start);
          for (const step of [16, 8, 4, 2, 1]) {
            for (let i = 0; i < set.count; i += step) {
              if (!seen.has(i)) {
                seen.add(i);
                order.push(i);
              }
            }
          }
          if (!seen.has(set.count - 1)) order.push(set.count - 1);
          resize();
          pump();
        })
        .catch(() => {
          /* poster stays visible */
        });
    };
    const kickEvents = ["wheel", "touchstart", "pointerdown", "keydown", "scroll"] as const;
    let idleTimer = 0;
    const cleanupTriggers = () => {
      kickEvents.forEach((ev) => window.removeEventListener(ev, begin));
      window.removeEventListener("load", onLoad);
      window.clearTimeout(idleTimer);
    };
    const onLoad = () => {
      idleTimer = window.setTimeout(begin, 900);
    };
    kickEvents.forEach((ev) => window.addEventListener(ev, begin, { passive: true, once: true }));
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    gsap.ticker.add(tick);
    return () => {
      disposed = true;
      cleanupTriggers();
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      imgs.forEach((im) => {
        if (im) {
          im.onload = null;
          im.onerror = null;
        }
      });
    };
  }, [manifestUrl, posterSrc, posterSrcPortrait]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel}
      className={`block h-full w-full ${className}`}
    />
  );
});
