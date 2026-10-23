"use client";

import { useEffect, useState, type RefObject } from "react";

// True once the element comes within `rootMargin` of the viewport (then stays true).
// Used to hold back heavy media (videos, posters, textures) until it's nearly needed.
export function useNear<T extends Element>(ref: RefObject<T | null>, rootMargin = "900px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, near]);
  return near;
}
