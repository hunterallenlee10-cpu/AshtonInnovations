"use client";

import { useEffect, type RefObject } from "react";

// Sets data-drawn on the element the first time enough of it is visible,
// which triggers the CSS line-drawing and word-rise transitions.
export function useDrawOnView<T extends HTMLElement | SVGElement>(
  ref: RefObject<T | null>,
  { threshold = 0.3, rootMargin = "0px" }: { threshold?: number; rootMargin?: string } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-drawn", "");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute("data-drawn", "");
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin]);
}
