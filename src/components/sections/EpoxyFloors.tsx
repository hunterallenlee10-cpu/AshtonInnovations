"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LookDown } from "@/components/epoxy/LookDown";
import { FinishTabs } from "@/components/epoxy/FinishTabs";
import { EpoxyFallback } from "@/components/epoxy/EpoxyFallback";
import { usePourMode } from "@/components/epoxy/capability";
import { SPACES, type Finish } from "@/components/epoxy/finishes";
import { CtaButton } from "@/components/consult/CtaButton";
import { Confirm } from "@/components/ui/Confirm";
import { RenderLabel } from "@/components/ui/Labels";
import "@/components/epoxy/epoxy.css";

gsap.registerPlugin(ScrollTrigger);

// three.js only loads on capable devices, and only near the section.
const EpoxyShader = dynamic(() => import("@/components/epoxy/EpoxyShader"), { ssr: false });

const POUR_PHASES = ["01 Pour", "02 Flow", "03 Mirror finish"];
const PANEL_ID = "epoxy-stage";

export function EpoxyFloors() {
  const mode = usePourMode();
  const [finish, setFinish] = useState<Finish>("metallic");
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const progressRef = useRef(0);
  const pourRef = useRef<HTMLDivElement>(null);

  const onReady = useCallback(() => setReady(true), []);
  const onFail = useCallback(() => setFailed(true), []);

  // Allow the shader import once the pour is within ~800px of the viewport.
  useEffect(() => {
    const el = pourRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Desktop: pin the pour for 150% of a screen; scroll drives flow -> mirror.
  useEffect(() => {
    const el = pourRef.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const phases = q<HTMLElement>("[data-pour-phase]");
      const bar = q<HTMLElement>("[data-pour-bar]")[0];
      let lastPh = -1;
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=150%",
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          if (bar) bar.style.transform = `scaleX(${p})`;
          const ph = p < 0.28 ? 0 : p < 0.72 ? 1 : 2;
          if (ph !== lastPh) {
            lastPh = ph;
            phases.forEach((n, i) => n.toggleAttribute("data-active", i === ph));
          }
        },
      });
      gsap.from(q("[data-pour-copy] > *"), {
        y: 36,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 65%" },
      });
    });

    mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
      // No pin: show the settled finish.
      progressRef.current = 1;
    });

    return () => mm.revert();
  }, []);

  const useShader = mode === "webgl" && !failed;
  const fallbackVariant = mode === "still" ? "still" : mode === "video" || failed ? "live" : "poster";

  return (
    <section
      id="epoxy"
      data-nav-theme="dark"
      aria-labelledby="epoxy-title"
      className="on-ink relative overflow-x-clip bg-ink-3 text-plaster"
    >
      <span id="epoxy-title" className="sr-only">
        Epoxy floor coatings, new from Ashton Innovations
      </span>

      <LookDown />

      {/* THE POUR */}
      <div ref={pourRef} className="relative md:h-[100dvh] md:overflow-hidden">
        <div
          id={PANEL_ID}
          role="tabpanel"
          aria-labelledby={`finish-tab-${finish}`}
          className="relative h-[64svh] min-h-[380px] overflow-hidden md:absolute md:inset-0 md:h-auto md:min-h-0"
        >
          <EpoxyFallback finish={finish} variant={fallbackVariant} />
          {useShader && near && (
            <div
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
                ready ? "opacity-100" : "opacity-0"
              }`}
            >
              <EpoxyShader
                finish={finish}
                progressRef={progressRef}
                pointerTarget={pourRef}
                label="Illustrative render: liquid metallic epoxy flowing across a floor and settling into a glossy mirror finish. Move the pointer to send ripples across it."
                onReady={onReady}
                onFail={onFail}
              />
            </div>
          )}
          {/* legibility shade for the copy (desktop overlay) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(115%_85%_at_0%_100%,rgba(12,12,12,0.95)_0%,rgba(12,12,12,0.72)_40%,rgba(12,12,12,0)_74%)] md:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(12,12,12,0.7)_0%,rgba(12,12,12,0.3)_34%,rgba(12,12,12,0)_56%)] md:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-3 to-transparent"
          />
          <div className="absolute bottom-4 right-[var(--gutter)] md:hidden">
            <RenderLabel className="text-plaster/75" />
          </div>
        </div>

        <div
          data-pour-copy
          className="relative px-[var(--gutter)] pb-14 pt-10 md:absolute md:bottom-0 md:left-0 md:w-[min(640px,52vw)] md:pb-[clamp(28px,6vh,64px)] md:pt-0"
        >
          <p className="annot text-plaster/60">
            New <span aria-hidden="true">/</span> Epoxy floor coatings
          </p>
          <h3 className="display mt-4 text-[clamp(2.9rem,5.6vw,5.4rem)] leading-[0.95]">
            Floors, finished like a ceiling.
          </h3>
          <p className="mt-5 max-w-[44ch] text-[clamp(16px,1.3vw,18px)] leading-[1.6] text-plaster/80">
            The same care that goes into a sculptured ceiling now goes into the floor beneath it. One
            crew handles the whole room, from the tray above to the coating underfoot.
          </p>
          <div className="mt-8">
            <FinishTabs value={finish} onChange={setFinish} panelId={PANEL_ID} />
          </div>
        </div>

        {/* HUD (desktop) */}
        <div className="pointer-events-none absolute bottom-0 right-0 hidden w-[min(440px,32vw)] px-[var(--gutter)] pb-[clamp(28px,6vh,64px)] md:block">
          <ol className="annot flex justify-between gap-4 text-plaster/60">
            {POUR_PHASES.map((p, i) => (
              <li
                key={p}
                data-pour-phase
                data-active={i === 0 ? "" : undefined}
                className="transition-colors duration-500 data-[active]:text-plaster"
              >
                {p}
              </li>
            ))}
          </ol>
          <div className="relative mt-4 h-px bg-plaster/15">
            <div data-pour-bar className="absolute inset-x-0 -top-px h-[2px] origin-left scale-x-0 bg-red" />
          </div>
          <div className="mt-4 text-right">
            <RenderLabel className="text-plaster/70" />
          </div>
        </div>
      </div>

      {/* Where it goes, the owner's photos, and the consultation */}
      <div className="relative px-[var(--gutter)] pb-[clamp(96px,14vh,160px)] pt-[clamp(72px,12vh,140px)]">
        <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <h4 className="annot text-plaster/70">Where it goes</h4>
              <Confirm note="Owner to confirm the spaces Ashton coats">{""}</Confirm>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {SPACES.map((sp) => (
                <li
                  key={sp}
                  className="flex min-h-11 items-center border border-line-light-strong px-4 text-[15px] text-plaster/90"
                >
                  {sp}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="max-w-[40ch] text-[17px] leading-[1.6] text-plaster/80">
              Garage, basement, shop or showroom: tell us about the floor and we’ll talk
              through the options with you.
            </p>
            <div className="mt-7">
              <CtaButton preselect="Epoxy Floor" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-[clamp(72px,10vh,120px)] max-w-[1600px]">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line-light pt-6">
            <h4 className="annot text-plaster/70">Ashton epoxy projects</h4>
            <p className="annot text-plaster/60">Real floors from Ashton’s crew go here before launch</p>
          </div>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n}>
                <figure className="print">
                  <div className="epx-slot relative grid aspect-[4/5] place-items-center">
                    <span
                      aria-hidden="true"
                      className="absolute inset-[10px] border border-dashed border-plaster/30"
                    />
                    <div className="relative px-6 text-center">
                      <p className="annot text-plaster/80">Your epoxy project photo here</p>
                      <p className="mt-3 text-[13px] text-plaster/65">Owner’s photo goes here</p>
                    </div>
                  </div>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
