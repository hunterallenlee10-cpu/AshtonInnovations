"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// One Lenis instance for the whole app, read at event time (no React state,
// so nothing re-renders while scrolling).
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView();
}

export function setScrollLocked(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);

  // A route change (e.g. the footer "Contact" link) always lands at the top,
  // unless the URL carries a hash for an in-page section.
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        requestAnimationFrame(() => scrollToTarget(el as HTMLElement));
        return;
      }
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return <>{children}</>;
}
