"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { CHIPS, type Finish } from "./finishes";
import "./epoxy.css";
import { useNear } from "@/lib/useNear";

/*
  The pour without WebGL: used on phones, low-power devices, reduced motion,
  and as the poster under the shader while it loads.
  - live:    D1 loop video for Metallic, textures for Solid / Flake (+ chip broadcast)
  - still:   reduced motion, no video
  - poster:  a single still (server render, or under the loading shader)
*/
export function EpoxyFallback({
  finish,
  variant,
}: {
  finish: Finish;
  variant: "live" | "still" | "poster";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const showFinish = finish;
  const near = useNear(rootRef, "1000px");
  const bg = (url: string) => (near ? { backgroundImage: `url(${url})` } : undefined);
  // Sources are added late, so ask the element to pick them up.
  useEffect(() => {
    if (near) videoRef.current?.load();
  }, [near]);

  // Only play while Metallic is showing and the stage is on screen.
  useEffect(() => {
    const v = videoRef.current;
    const root = rootRef.current;
    if (!v || !root) return;
    let onScreen = false;
    const sync = () => {
      if (onScreen && finish === "metallic") v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(root);
    sync();
    return () => {
      io.disconnect();
      v.pause();
    };
  }, [finish, variant]);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden bg-ink-3" aria-hidden={variant === "poster" ? true : undefined}>
      {/* Metallic */}
      <div className={`epx-layer ${showFinish === "metallic" ? "epx-layer-on" : ""}`}>
        {variant === "live" ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            poster={near ? "/video/epoxy-loop.jpg" : undefined}
            aria-label="Illustrative render: liquid metallic epoxy in ink, charcoal and silver swirling slowly, seen from directly above."
          >
            {near && <source src="/video/epoxy-loop.webm" type="video/webm" />}
            {near && <source src="/video/epoxy-loop.mp4" type="video/mp4" />}
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={near ? "/video/epoxy-loop.jpg" : undefined}
            alt={variant === "still" ? "Illustrative render: a metallic epoxy floor in ink, charcoal and silver, seen from directly above." : ""}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      {/* Solid */}
      <div
        className={`epx-layer ${showFinish === "solid" ? "epx-layer-on" : ""}`}
        role={variant === "poster" ? undefined : "img"}
        aria-label={variant === "poster" ? undefined : "Illustrative render: a solid gray epoxy floor with a satin finish."}
      >
        <div className="epx-tile" style={bg("/textures/e1-solid.webp")} />
      </div>

      {/* Flake: chips land on the base coat, then the full broadcast fades in */}
      <div
        className={`epx-layer ${showFinish === "flake" ? "epx-layer-on" : ""}`}
        role={variant === "poster" ? undefined : "img"}
        aria-label={variant === "poster" ? undefined : "Illustrative render: a decorative flake epoxy floor with gray, black and white chips."}
      >
        <div className="epx-tile" style={bg("/textures/e1-solid.webp")} />
        <div className={`epx-tile epx-flake-tex`} style={bg("/textures/e2-flake.webp")} />
        {variant === "live" &&
          CHIPS.map((c, i) => (
            <span
              key={i}
              className="epx-chip"
              style={
                {
                  "--x": `${c.x}%`,
                  "--y": `${c.y}%`,
                  "--s": `${c.s}px`,
                  "--r": `${c.r}deg`,
                  "--c": c.c,
                  "--d": `${c.d}s`,
                } as CSSProperties
              }
            />
          ))}
      </div>

      <div className="epx-gloss" />
    </div>
  );
}
