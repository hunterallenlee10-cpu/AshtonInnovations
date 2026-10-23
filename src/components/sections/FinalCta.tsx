"use client";

import { motion, useReducedMotion } from "motion/react";
import { business } from "@/data/business";
import { CtaButton } from "@/components/consult/CtaButton";

/*
  The bookend: a ceiling line and a floor line draw in around the last line
  of the page, the same span the visitor just scrolled through.
*/

export function FinalCta() {
  const reduce = useReducedMotion();
  const ease = [0.65, 0, 0.35, 1] as const;
  // Keep the reveal props in every mode (the server can't know the visitor's
  // motion preference); under reduced motion they simply resolve instantly.
  const lineIn = (delay: number) => ({
    initial: { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: { once: true, amount: 0.4 },
    transition: reduce ? { duration: 0 } : { duration: 1.6, delay, ease },
  });
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: reduce ? { duration: 0 } : { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="consult"
      data-nav-theme="dark"
      aria-labelledby="consult-title"
      className="on-ink relative overflow-hidden bg-ink py-[clamp(96px,14vw,200px)] text-plaster"
    >
      <div className="blueprint-grid blueprint-grid-faint on-ink pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1440px] px-[var(--gutter)]">
        {/* ceiling line */}
        <div className="flex items-center gap-4">
          <span className="annot shrink-0 text-plaster/55">Ceiling</span>
          <motion.span aria-hidden="true" className="block h-px flex-1 origin-left bg-plaster/45" {...lineIn(0)} />
        </div>

        <div className="py-[clamp(56px,9vw,128px)]">
          <motion.h2
            id="consult-title"
            className="display max-w-[12ch] pb-2 text-[clamp(3.6rem,10.5vw,9.4rem)] leading-[0.9]"
            {...rise(0.25)}
          >
            From the ceiling to the floor.
          </motion.h2>

          <motion.div
            className="mt-[clamp(40px,6vw,72px)] flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
            {...rise(0.45)}
          >
            <CtaButton />
            <div className="md:text-right">
              <p className="annot text-plaster/60">Or call the office</p>
              <a
                href={business.phone.href}
                className="display mt-2 inline-flex min-h-11 items-center text-[clamp(2.6rem,6vw,5rem)] leading-none tabular-nums transition-opacity hover:opacity-80"
              >
                {business.phone.display}
              </a>
            </div>
          </motion.div>
        </div>

        {/* floor line */}
        <div className="flex items-center gap-4">
          <span className="annot shrink-0 text-plaster/55">Floor</span>
          <motion.span aria-hidden="true" className="block h-px flex-1 origin-left bg-plaster/45" {...lineIn(0.2)} />
          <motion.span aria-hidden="true" className="block h-[3px] w-[clamp(48px,8vw,120px)] origin-left bg-red" {...lineIn(1.1)} />
        </div>
      </div>
    </section>
  );
}
