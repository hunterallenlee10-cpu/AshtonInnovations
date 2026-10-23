"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSequence, PORTRAIT_QUERY, type SequenceHandle } from "@/components/engine/ScrollSequence";
import { ReflectedCeilingPlan } from "@/components/hero/ReflectedCeilingPlan";
import { CtaButton } from "@/components/consult/CtaButton";
import { RenderLabel, ProjectCaption } from "@/components/ui/Labels";
import { photoById } from "@/data/photos";

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  { n: "01", label: "Frame", from: 0 },
  { n: "02", label: "Hang & finish", from: 0.16 },
  { n: "03", label: "Reveal", from: 0.62 },
];

// Scroll map (fractions of the hero's scroll length)
const SEQ_START = 0.04;
const SEQ_END = 0.78;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function CeilingHero() {
  const root = useRef<HTMLElement>(null);
  const seq = useRef<SequenceHandle>(null);
  const tray = photoById("01");
  // The real photo for the end beat loads once the visitor is on the way there.
  const [showEnd, setShowEnd] = useState(false);
  const endShown = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const q = gsap.utils.selector(el);
    const phaseEls = q<HTMLElement>("[data-phase]");
    const bar = q<HTMLElement>("[data-bar]")[0];
    let lastPhase = -1;

    const ctx = gsap.context(() => {
      const portrait = window.matchMedia(PORTRAIT_QUERY).matches;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el.querySelector(".hero-track"),
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const fp = clamp01((p - SEQ_START) / (SEQ_END - SEQ_START));
            seq.current?.setProgress(fp);
            if (!endShown.current && p > 0.3) {
              endShown.current = true;
              setShowEnd(true);
            }
            if (bar) bar.style.transform = `scaleX(${fp})`;
            let ph = 0;
            PHASES.forEach((x, i) => {
              if (fp >= x.from) ph = i;
            });
            if (ph !== lastPhase) {
              lastPhase = ph;
              phaseEls.forEach((n, i) => n.toggleAttribute("data-active", i === ph));
            }
          },
        },
      });

      // 0 to 0.16: the drawing becomes the structure
      tl.to(q("[data-copy]"), { autoAlpha: 0, y: -48, duration: 0.07 }, 0.0)
        .fromTo(q("[data-media]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.02)
        .to(q("[data-plan]"), { autoAlpha: 0, duration: 0.12 }, 0.05)
        .to(q("[data-shade]"), { autoAlpha: 0, duration: 0.08 }, 0.04)
        .fromTo(q("[data-hud]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04 }, 0.08)
        // end beat: the render shrinks into a framed print...
        .to(q("[data-hud]"), { autoAlpha: 0, duration: 0.03 }, SEQ_END + 0.01)
        .to(
          q("[data-stage]"),
          {
            scale: portrait ? 0.62 : 0.5,
            xPercent: portrait ? 0 : -21,
            yPercent: portrait ? -15 : -2,
            ease: "power2.inOut",
            duration: 0.1,
          },
          SEQ_END + 0.01,
        )
        .fromTo(q("[data-mat]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, SEQ_END + 0.04)
        .fromTo(q("[data-render-cap]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, SEQ_END + 0.08)
        // ...then crossfades to the real Ashton tray ceiling
        .fromTo(
          q("[data-real]"),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" },
          SEQ_END + 0.12,
        )
        .to(q("[data-stage]"), { autoAlpha: 0, duration: 0.06 }, SEQ_END + 0.13)
        .to(q("[data-render-cap]"), { autoAlpha: 0, duration: 0.03 }, SEQ_END + 0.12)
        .fromTo(
          q("[data-end]"),
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" },
          SEQ_END + 0.15,
        )
        .to({}, { duration: 0.02 }, 0.98);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      data-nav-theme="dark"
      aria-label="Look up: decorative ceilings by Ashton Innovations"
      className="on-ink relative bg-ink text-plaster"
    >
      <div className="hero-track relative h-[460vh] tall:h-[400vh]">
        <div className="hero-sticky sticky top-0 h-[100dvh] overflow-hidden">
          <div className="blueprint-grid blueprint-grid-faint on-ink absolute inset-0" aria-hidden="true" />

          {/* The render. Shrinks into a print at the end. */}
          <div data-stage className="hero-media absolute inset-0 will-change-transform">
            <div
              data-mat
              aria-hidden="true"
              className="invisible absolute -inset-[3.2%] bg-[#faf8f4] opacity-0 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.75)]"
            />
            <div data-media className="invisible absolute inset-0 opacity-0">
              <ScrollSequence
                ref={seq}
                className="absolute inset-0"
                posterSrc="/video/poster-start.jpg"
                posterSrcPortrait="/video/poster-start-mobile.jpg"
                ariaLabel="Illustrative render: a tray ceiling goes from bare wood framing, to hung and taped drywall, to a finished, painted ceiling with a glowing cove and chandelier."
              />
            </div>
            <div
              data-render-cap
              className="invisible absolute left-0 top-[103.6%] opacity-0"
            >
              <RenderLabel className="text-[22px] text-muted-light" />
            </div>
          </div>

          {/* Reflected ceiling plan, drawn on load */}
          <div data-plan className="absolute inset-0">
            <ReflectedCeilingPlan className="absolute inset-0" />
          </div>

          {/* legibility shade behind the hero copy */}
          <div
            data-shade
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_100%,rgba(20,20,20,0.92)_0%,rgba(20,20,20,0.55)_45%,rgba(20,20,20,0)_75%)]"
          />

          {/* Hero copy */}
          <div
            data-copy
            className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-[clamp(28px,7vh,72px)]"
          >
            <p className="annot hero-in text-muted-light" style={{ ["--in" as string]: "0.2s" }}>
              Sheet A-1 <span aria-hidden="true">/</span> Reflected ceiling plan{" "}
              <span aria-hidden="true">/</span> 1:48
            </p>
            <h1
              className="display hero-in mt-4 text-[clamp(4.6rem,13.5vw,10rem)] leading-[0.86]"
              style={{ ["--in" as string]: "0.55s" }}
            >
              <span className="sr-only">Ashton Innovations. </span>Look up.
            </h1>
            <p
              className="hero-in mt-6 max-w-[34ch] text-[clamp(17px,1.45vw,20px)] leading-[1.5] text-plaster/85"
              style={{ ["--in" as string]: "0.9s" }}
            >
              Decorative ceilings, flawless walls, and now epoxy floors, for Virginia’s finest
              homes. Drywall by design.
            </p>
            <div className="hero-in mt-8" style={{ ["--in" as string]: "1.15s" }}>
              <CtaButton />
            </div>
          </div>

          {/* HUD */}
          <div
            data-hud
            className="hero-hud invisible absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent px-[var(--gutter)] pb-6 pt-24 opacity-0"
          >
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <ol className="annot flex gap-x-6 gap-y-1 text-plaster/60 max-sm:flex-col">
                {PHASES.map((p, i) => (
                  <li
                    key={p.n}
                    data-phase
                    data-active={i === 0 ? "" : undefined}
                    className="transition-colors duration-500 data-[active]:text-plaster"
                  >
                    {p.n} {p.label}
                  </li>
                ))}
              </ol>
              <RenderLabel className="text-plaster/70" />
            </div>
            <div className="relative mt-4 h-px bg-plaster/15">
              <div
                data-bar
                className="absolute inset-0 origin-left scale-x-0 bg-red"
                style={{ height: 2, top: -0.5 }}
              />
            </div>
          </div>

          {/* End beat: the real tray ceiling */}
          <div className="hero-end pointer-events-none absolute inset-0">
            <div className="absolute left-[29%] top-1/2 w-[min(46vh,36vw)] -translate-x-1/2 -translate-y-1/2 tall:left-1/2 tall:top-[35%] tall:w-[min(62vw,40vh)]">
            <figure data-real className="invisible opacity-0">
              <div className="print">
                {showEnd ? (
                  <Image
                    src={tray.src}
                    alt={tray.alt}
                    width={tray.width}
                    height={tray.height}
                    sizes="(max-aspect-ratio: 4/5) 60vw, 40vw"
                    className="h-auto w-full"
                  />
                ) : (
                  <div className="aspect-square w-full bg-plaster-3" />
                )}
              </div>
              <figcaption className="mt-3">
                <ProjectCaption caption="Tray ceiling" className="text-plaster/75" />
              </figcaption>
            </figure>
            </div>
            <div className="absolute right-[var(--gutter)] top-1/2 w-[38%] max-w-[30rem] -translate-y-1/2 tall:inset-x-[var(--gutter)] tall:bottom-[7vh] tall:top-auto tall:w-auto tall:max-w-none tall:translate-y-0">
              <div data-end className="pointer-events-auto invisible opacity-0">
                <p className="annot text-plaster/60">From the render to a real Ashton ceiling</p>
                <p className="display mt-4 text-[clamp(3rem,6vw,5.6rem)]">Now picture yours.</p>
                <div className="mt-8">
                  <CtaButton preselect="Tray Ceilings" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reduced motion: the finished state, no scrubbing */}
      <div className="hero-static-end px-[var(--gutter)] pb-24 pt-8">
        <div className="grid items-end gap-10 md:grid-cols-[1.4fr_1fr]">
          <figure>
            <div className="print">
              <Image
                src="/renders/kf3-tray.webp"
                alt="Illustrative render of a finished two-step tray ceiling with a glowing cove and a medallion chandelier, seen from directly below."
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, 55vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-3">
              <RenderLabel className="text-plaster/70" />
            </figcaption>
          </figure>
          <figure>
            <div className="print">
              <Image src={tray.src} alt={tray.alt} width={tray.width} height={tray.height} sizes="(max-width: 768px) 100vw, 35vw" className="h-auto w-full" />
            </div>
            <figcaption className="mt-3">
              <ProjectCaption caption="Tray ceiling" className="text-plaster/75" />
            </figcaption>
          </figure>
        </div>
        <p className="display mt-14 text-[clamp(3rem,6vw,5.6rem)]">Now picture yours.</p>
      </div>
    </section>
  );
}
