"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FramedPrint } from "@/components/ui/FramedPrint";
import { photoById } from "@/data/photos";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { key: "frame", name: "Framing", text: "The structure the ceiling and walls will follow. Every line of the design starts here." },
  { key: "board", name: "Board hung", text: "Gypsum board fastened to the framing, cut tight around every opening and box." },
  { key: "mud", name: "Tape & mud", text: "Joints taped and coated in thin passes, feathered wide so seams disappear." },
  { key: "texture", name: "Texture / Sand", text: "Knock-down texture where it’s specified, or sanded smooth and checked under a light." },
  { key: "prime", name: "Prime", text: "A primer coat that seals the board and the compound so the finish reads as one surface." },
  { key: "paint", name: "Paint", text: "The finish coat. The only layer anyone sees, and the reason for all the others." },
];

// Wall section drawing. viewBox 600 x 1180: ceiling at the top, floor at ~1040.
function WallSection() {
  const L = (cls: string, d: string, step: string, extra = "") => (
    <path data-step={step} className={`proc ${cls} ${extra}`} pathLength={1} d={d} />
  );
  return (
    <svg viewBox="0 0 600 1180" className="ink-lines h-auto w-full overflow-visible" role="img" aria-label="Wall cross-section drawing that builds layer by layer: framing, board, tape and mud, texture, primer and a red finish coat, ending at the floor line.">
      {/* framing */}
      {L("k", "M60 40 H560 M60 0 H560 M60 0 V40", "frame")}
      {L("l", "M80 6 L110 34 M130 6 L160 34 M180 6 L210 34 M230 6 L260 34 M280 6 L310 34 M330 6 L360 34", "frame")}
      {L("k", "M120 40 V1028 M190 40 V1028", "frame")}
      {L("k", "M120 72 H190 M120 996 H190", "frame")}
      {L("l", "M138 90 Q150 300 140 520 T150 980 M160 90 Q172 360 164 600 T170 980", "frame")}
      {/* board */}
      {L("k", "M196 40 V520 M196 534 V1028 M216 40 V520 M216 534 V1028 M196 520 H216 M196 534 H216", "board")}
      {L("l", "M190 160 H222 M190 300 H222 M190 440 H222 M190 640 H222 M190 780 H222 M190 920 H222", "board")}
      {/* tape & mud */}
      {L("k", "M216 360 Q236 440 228 527 Q236 614 216 694", "mud")}
      {L("l", "M216 470 H226 M216 584 H226", "mud")}
      {/* texture */}
      {L("", "M232 40 Q236 70 232 100 T232 160 T232 220 T232 280 T232 340 T232 400 T232 460 T232 520 T232 580 T232 640 T232 700 T232 760 T232 820 T232 880 T232 940 T232 1000 L232 1028", "texture")}
      {/* prime */}
      {L("l", "M240 40 V1028", "prime", "prime-line")}
      {/* paint */}
      {L("r", "M246 40 V1028", "paint", "paint-line")}
      {/* floor */}
      {L("k", "M0 1040 H600", "floor")}
      {L("k", "M246 984 H272 V1040 M246 996 H264", "floor")}
      {L("l", "M10 1052 L30 1072 M60 1052 L80 1072 M110 1052 L130 1072 M160 1052 L180 1072 M210 1052 L230 1072 M260 1052 L280 1072 M310 1052 L330 1072 M360 1052 L380 1072 M410 1052 L430 1072 M460 1052 L480 1072 M510 1052 L530 1072 M560 1052 L580 1072", "floor")}

      {/* labels */}
      <g className="proc-label" data-step="frame">
        <path className="l" d="M190 210 H330" />
        <text x={340} y={214}>WOOD FRAMING</text>
      </g>
      <g className="proc-label" data-step="board">
        <path className="l" d="M216 300 H330" />
        <text x={340} y={304}>GYPSUM BOARD</text>
      </g>
      <g className="proc-label" data-step="mud">
        <path className="l" d="M230 527 H330" />
        <text x={340} y={531}>TAPE + COMPOUND</text>
      </g>
      <g className="proc-label" data-step="texture">
        <path className="l" d="M234 700 H330" />
        <text x={340} y={704}>TEXTURE / SAND</text>
      </g>
      <g className="proc-label" data-step="prime">
        <path className="l" d="M240 800 H330" />
        <text x={340} y={804}>PRIMER</text>
      </g>
      <g className="proc-label" data-step="paint">
        <path className="r" d="M246 880 H330" />
        <text x={340} y={884} className="fill-red">FINISH COAT</text>
      </g>
      <g className="proc-label" data-step="floor">
        <text x={340} y={1030}>FLOOR LINE</text>
        <text x={340} y={1100} className="fill-red">NEXT: THE FLOOR</text>
      </g>
    </svg>
  );
}

export function Process() {
  const root = useRef<HTMLElement>(null);
  const crew = photoById("drywall4");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);
    const stepEls = q<HTMLElement>("[data-step-item]");
    const setActive = (i: number) => stepEls.forEach((n, k) => n.toggleAttribute("data-active", k === i));

    if (reduce) {
      el.setAttribute("data-static", "");
      return;
    }

    const mm = gsap.matchMedia(el);
    // Desktop: pin the section and build the wall layer by layer, then pan to the floor.
    mm.add("(min-width: 1024px)", () => {
      gsap.set(q(".proc"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q(".proc-label"), { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 2.8)}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const i = 1 + Math.floor((self.progress / 0.84) * (STEPS.length - 1));
            setActive(self.progress <= 0.001 ? 0 : Math.min(STEPS.length - 1, i));
          },
        },
      });
      // Framing draws while the section scrolls into view, so the pin starts on a drawing.
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", end: "top top", scrub: 0.6 } })
        .to(q('.proc[data-step="frame"]'), { strokeDashoffset: 0, duration: 1, stagger: 0.1, ease: "none" })
        .to(q('.proc-label[data-step="frame"]'), { autoAlpha: 1, duration: 0.3 }, 0.7);
      const rest = STEPS.slice(1);
      const slot = 0.84 / rest.length;
      rest.forEach((s, i) => {
        const at = i * slot;
        tl.to(q(`.proc[data-step="${s.key}"]`), { strokeDashoffset: 0, duration: slot * 0.8, stagger: slot * 0.08 }, at);
        tl.to(q(`.proc-label[data-step="${s.key}"]`), { autoAlpha: 1, duration: slot * 0.3 }, at + slot * 0.35);
      });
      // last beat: pan down to the floor line, leading into the epoxy section
      tl.to(q("[data-pan]"), { yPercent: -34, duration: 0.14, ease: "power2.inOut" }, 0.86);
      tl.to(q('.proc[data-step="floor"]'), { strokeDashoffset: 0, duration: 0.1 }, 0.88);
      tl.to(q('.proc-label[data-step="floor"]'), { autoAlpha: 1, duration: 0.06 }, 0.93);
    });
    // Small screens: no pin; the drawing builds as it scrolls past.
    mm.add("(max-width: 1023px)", () => {
      gsap.set(q(".proc"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q(".proc-label"), { autoAlpha: 0 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: q("[data-pan]")[0], start: "top 75%", end: "bottom 60%", scrub: 0.6 },
      });
      [...STEPS.map((s) => s.key), "floor"].forEach((k, i) => {
        tl.to(q(`.proc[data-step="${k}"]`), { strokeDashoffset: 0, duration: 0.8 }, i);
        tl.to(q(`.proc-label[data-step="${k}"]`), { autoAlpha: 1, duration: 0.3 }, i + 0.4);
      });
    });
    const ctx = { revert: () => mm.revert() };
    setActive(0);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="process"
      data-nav-theme="light"
      aria-labelledby="process-title"
      className="process plaster-surface relative overflow-hidden"
    >
      <div className="relative mx-auto grid max-w-[1440px] gap-x-[clamp(32px,6vw,96px)] px-[var(--gutter)] lg:h-[100dvh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col justify-center pb-8 pt-[clamp(96px,12vw,140px)] lg:py-[calc(var(--nav-h)+24px)]">
          <h2 id="process-title" className="display text-[clamp(3rem,5.6vw,5.8rem)] leading-[0.94]">
            From blueprint
            <br />
            to finish.
          </h2>
          <ol className="mt-10 max-w-[30rem] border-t border-line max-lg:hidden">
            {STEPS.map((s, i) => (
              <li
                key={s.key}
                data-step-item
                data-active={i === 0 ? "" : undefined}
                className="group border-b border-line py-3 text-muted transition-colors duration-500 data-[active]:text-ink"
              >
                <div className="flex items-baseline gap-4">
                  <span className="mt-[0.45em] h-px w-5 shrink-0 bg-line-strong transition-[background-color] duration-500 group-data-[active]:bg-red" aria-hidden="true" />
                  <span className="text-[19px] font-medium">{s.name}</span>
                </div>
                <p className="grid grid-rows-[0fr] pl-9 text-[15px] leading-relaxed opacity-0 transition-[grid-template-rows,opacity] duration-500 group-data-[active]:grid-rows-[1fr] group-data-[active]:opacity-100 [[data-static]_&]:grid-rows-[1fr] [[data-static]_&]:opacity-100">
                  <span className="min-h-0 overflow-hidden pt-1">{s.text}</span>
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-10 grid max-w-[30rem] grid-cols-[96px_1fr] items-start gap-5 max-lg:hidden">
            <FramedPrint photo={crew} sizes="96px" caption={false} />
            <p className="text-[15px] leading-relaxed text-muted">
              <span className="text-ink">Every crew member wears a hard hat on entering a home.</span>{" "}
              Ashton is OSHA compliant, because a careful finish starts with a careful crew.
            </p>
          </div>
        </div>

        <div className="relative lg:h-full lg:overflow-hidden">
          <div data-pan className="mx-auto w-full max-w-[620px] lg:absolute lg:inset-x-0 lg:top-[calc(var(--nav-h)+24px)]">
            <WallSection />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-16 bg-gradient-to-t from-plaster to-transparent lg:block" aria-hidden="true" />
        </div>

        {/* small screens: steps as a compact list after the drawing */}
        <div className="pb-[clamp(72px,12vw,120px)] lg:hidden">
          <ol className="grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
            {STEPS.map((s) => (
              <li key={s.key}>
                <p className="text-[17px] font-medium">{s.name}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 grid grid-cols-[88px_1fr] items-start gap-4">
            <FramedPrint photo={crew} sizes="88px" caption={false} />
            <p className="text-[15px] leading-relaxed text-muted">
              <span className="text-ink">Every crew member wears a hard hat on entering a home.</span>{" "}
              Ashton is OSHA compliant, because a careful finish starts with a careful crew.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
