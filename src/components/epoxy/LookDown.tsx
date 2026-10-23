"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RenderLabel } from "@/components/ui/Labels";
import { useNear } from "@/lib/useNear";

gsap.registerPlugin(ScrollTrigger);

/*
  "Look down." The camera tilts from a coffered ceiling to an epoxy floor.
  The clip plays once when it scrolls into view (never scrubbed by currentTime);
  reduced motion gets the final frame as a still.
*/
export function LookDown() {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const near = useNear(root, "1000px");
  // Sources are added late, so ask the element to pick them up.
  useEffect(() => {
    if (near) videoRef.current?.load();
  }, [near]);

  useEffect(() => {
    const el = root.current;
    const v = videoRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) return;
      // The headline drifts downward as you scroll: the eye follows it to the floor.
      gsap.fromTo(
        "[data-ld-head]",
        { yPercent: -14 },
        {
          yPercent: 26,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      // A red plumb line drops from the headline to the frame.
      gsap.fromTo(
        "[data-ld-plumb]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 75%", end: "center 55%", scrub: true },
        },
      );
      gsap.fromTo(
        "[data-ld-frame]",
        { y: 70, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-ld-frame]", start: "top 88%" },
        },
      );
      if (v) {
        ScrollTrigger.create({
          trigger: v,
          start: "top 70%",
          onEnter: () => {
            v.play().catch(() => {});
          },
          onLeaveBack: () => {
            v.pause();
            v.currentTime = 0;
          },
        });
      }
    }, el);

    return () => {
      ctx.revert();
      v?.pause();
    };
  }, []);

  return (
    <div ref={root} className="relative px-[var(--gutter)] pb-[clamp(72px,12vh,140px)] pt-[clamp(96px,18vh,200px)]">
      <div className="blueprint-grid blueprint-grid-faint on-ink pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1600px]">
        <h2
          data-ld-head
          className="display relative z-10 text-[clamp(4.6rem,14.5vw,10.5rem)] leading-[0.86] will-change-transform"
        >
          Look down.
        </h2>

        <div className="relative mt-10 grid gap-10 md:mt-[-0.6em] md:grid-cols-12 md:gap-8">
          <div className="relative md:col-span-3 md:pt-[clamp(120px,14vw,220px)]">
            <p className="max-w-[30ch] text-[17px] leading-[1.6] text-plaster/80">
              Ashton finishes every surface of a room: the ceiling above you, the walls around you,
              and now the floor beneath you.
            </p>
            <p className="annot mt-6 text-plaster/65">
              Sheet F-1 <span aria-hidden="true">/</span> Ceiling to floor
            </p>
          </div>

          <figure className="relative md:col-span-9">
            <span
              data-ld-plumb
              aria-hidden="true"
              className="absolute -top-[clamp(40px,6vw,96px)] left-0 hidden h-[clamp(40px,6vw,96px)] w-px origin-top bg-red md:block"
            />
            <div data-ld-frame className="relative aspect-video overflow-hidden bg-ink-2 outline outline-1 outline-plaster/10">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
                muted
                playsInline
                preload="metadata"
                poster={near ? "/video/look-down.jpg" : undefined}
                aria-label="Illustrative render: the camera tilts down from a coffered ceiling to a glossy metallic epoxy floor."
              >
                {near && <source src="/video/look-down.webm" type="video/webm" />}
                {near && <source src="/video/look-down.mp4" type="video/mp4" />}
              </video>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={near ? "/video/look-down-end.jpg" : undefined}
                alt="Illustrative render: a glossy metallic epoxy floor reflecting a coffered ceiling and windows."
                loading="lazy"
                className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-6">
              <RenderLabel className="text-plaster/60" />
              <span className="annot text-plaster/60">Ceiling, walls, floor</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
