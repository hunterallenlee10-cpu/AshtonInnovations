"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { photoById } from "@/data/photos";
import { ProjectCaption } from "@/components/ui/Labels";
import { CtaButton } from "@/components/consult/CtaButton";

type Side = {
  key: "builders" | "homeowners";
  tab: string;
  statement: string;
  points: string[];
  main: string;
  inset: string;
  insetRound?: boolean;
};

const sides: Side[] = [
  {
    key: "builders",
    tab: "For builders",
    statement: "One sub for ceilings, walls, paint and garage floors.",
    points: [
      "A crew that shows up when the schedule says it will.",
      "Clean jobsites: fireplaces, tubs and windows are covered in plastic before work starts.",
      "Design upgrades that help your homes sell.",
      "Every crew member wears a hard hat on entering a home. OSHA compliant.",
    ],
    main: "drywall3",
    inset: "truck",
    insetRound: true,
  },
  {
    key: "homeowners",
    tab: "For homeowners",
    statement: "A one-of-a-kind look, traditional or contemporary.",
    points: [
      "A design consultation before a single board is hung.",
      "Ceilings and walls for Colonials, Victorians and Contemporaries.",
      "The garage or basement floor finished to match.",
      "One crew from the ceiling to the floor.",
    ],
    main: "dbloct2",
    inset: "20",
  },
];

export function Audience() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const side = sides[active];
  const main = photoById(side.main);
  const inset = photoById(side.inset);

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? sides.length - 1 : (active + (e.key === "ArrowRight" ? 1 : -1) + sides.length) % sides.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="audience"
      data-nav-theme="light"
      aria-labelledby="audience-title"
      className="relative overflow-hidden bg-plaster-2 py-[clamp(96px,14vw,200px)] text-ink"
    >
      <div className="blueprint-grid blueprint-grid-faint pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-[var(--gutter)]">
        <h2 id="audience-title" className="sr-only">
          Who we work with
        </h2>

        {/* Segmented toggle */}
        <div
          role="tablist"
          aria-label="Who is this for?"
          onKeyDown={onKey}
          className="relative inline-grid grid-cols-2 border border-ink"
        >
          {sides.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${uid}-tab-${s.key}`}
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative z-10 min-h-12 px-[clamp(18px,3vw,36px)] text-[15px] font-medium transition-colors duration-500 ${
                  on ? "text-plaster" : "text-ink hover:bg-plaster-3"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId={`${uid}-pill`}
                    className="absolute inset-0 -z-10 bg-ink"
                    transition={{ duration: reduce ? 0 : 0.55, ease }}
                    aria-hidden="true"
                  />
                )}
                {s.tab}
              </button>
            );
          })}
        </div>

        <div
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${side.key}`}
          className="mt-[clamp(48px,7vw,96px)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={side.key}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: reduce ? 0.01 : 0.6, ease }}
              className="grid items-start gap-x-[clamp(32px,6vw,120px)] gap-y-16 lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div>
                <p className="display text-[clamp(2.7rem,6vw,5.6rem)] leading-[0.98]">{side.statement}</p>
                <ul className="mt-[clamp(36px,5vw,64px)] grid gap-x-10 sm:grid-cols-2">
                  {side.points.map((p) => (
                    <li key={p} className="border-t border-line-strong py-5 text-[17px] leading-relaxed">
                      <span aria-hidden="true" className="mb-3 block h-px w-6 bg-red" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <CtaButton />
                </div>
              </div>

              {/* Photo pair: a print with a smaller print (or the round truck seal) over its corner */}
              <figure className="pl-[clamp(0px,4vw,56px)] pr-[6%]">
                <div className="relative">
                  <div className="print">
                    <Image
                      src={main.src}
                      alt={main.alt}
                      width={main.width}
                      height={main.height}
                      sizes="(max-width: 1024px) 90vw, 36vw"
                      className="h-auto w-full"
                    />
                  </div>
                  <div className="absolute bottom-[-14%] right-[-7%] w-[40%]">
                  {side.insetRound ? (
                    <div className="aspect-square overflow-hidden rounded-full bg-[#faf8f4] p-[6px] shadow-[0_18px_40px_-18px_rgba(40,28,16,0.45)]">
                      <Image
                        src={inset.src}
                        alt={inset.alt}
                        width={inset.width}
                        height={inset.height}
                        sizes="(max-width: 1024px) 40vw, 15vw"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="print">
                      <Image
                        src={inset.src}
                        alt={inset.alt}
                        width={inset.width}
                        height={inset.height}
                        sizes="(max-width: 1024px) 40vw, 15vw"
                        className="h-auto w-full"
                      />
                    </div>
                  )}
                  </div>
                </div>
                <figcaption className="grid gap-1.5 pr-[38%] pt-[clamp(20px,4vw,48px)]">
                  <ProjectCaption caption={main.caption} className="text-muted" />
                  <ProjectCaption caption={inset.caption} className="text-muted" />
                </figcaption>
              </figure>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
