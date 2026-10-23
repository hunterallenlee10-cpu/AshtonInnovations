"use client";

import { useRef } from "react";
import { business } from "@/data/business";
import { Confirm } from "@/components/ui/Confirm";
import { useDrawOnView } from "@/lib/useDrawOnView";

// Words rise line by line; facts sit on dimension lines like a drawing.
const LINES: { words: string[]; em?: number[] }[] = [
  { words: ["Most", "homes", "ignore"] },
  { words: ["the", "fifth", "wall."], em: [1, 2] },
  { words: ["Yours", "won’t."] },
];

function DimLine({ d = 0 }: { d?: number }) {
  return (
    <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="ink-lines h-6 w-full overflow-visible" aria-hidden="true">
      <path className="draw l" pathLength={1} style={{ ["--d" as string]: d }} d="M0 4 V20 M400 4 V20" vectorEffect="non-scaling-stroke" />
      <path className="draw" pathLength={1} style={{ ["--d" as string]: d + 150 }} d="M0 12 H400" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function StatementStrip() {
  const ref = useRef<HTMLElement>(null);
  useDrawOnView(ref, { threshold: 0.25 });
  let i = 0;

  return (
    <section
      ref={ref}
      id="statement"
      data-nav-theme="light"
      aria-labelledby="statement-title"
      className="plaster-surface relative overflow-hidden"
    >
      <div className="blueprint-grid blueprint-grid-faint pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-[var(--gutter)] py-[clamp(110px,15vw,220px)]">
        <h2
          id="statement-title"
          className="display max-w-[13ch] text-[clamp(3.3rem,8.2vw,8.6rem)] leading-[0.95]"
        >
          {LINES.map((line, li) => (
            <span key={li} className="block">
              {line.words.map((w, wi) => {
                const idx = i++;
                return (
                  <span key={wi} className="rise-line">
                    <span className="rise-word" style={{ ["--i" as string]: idx }}>
                      {line.em?.includes(wi) ? <em className="italic">{w}</em> : w}
                    </span>
                    {wi < line.words.length - 1 ? " " : null}
                  </span>
                );
              })}
            </span>
          ))}
        </h2>
        <p className="draw-fade mt-10 max-w-[48ch] text-[clamp(17px,1.4vw,20px)] leading-relaxed text-muted" style={{ ["--d" as string]: 700 }}>
          Over{" "}
          <Confirm note="Their 2006 copy says over 20 years; the real number is likely higher.">
            {business.years.drywall.value}
          </Confirm>{" "}
          years in drywall installation and{" "}
          <Confirm note="Their 2006 copy says 15 years; the real number is likely higher.">
            {business.years.decorative.value}
          </Confirm>{" "}
          in decorative drywall design, working with homebuilders and homeowners on a one-of-a-kind
          look, traditional or contemporary. It starts with the ceiling, and now it reaches the floor.
        </p>

        <dl className="mt-[clamp(72px,9vw,128px)] grid gap-x-[clamp(24px,4vw,64px)] gap-y-14 md:grid-cols-[1fr_1fr_1.25fr]">
          <div>
            <DimLine d={500} />
            <dt className="sr-only">Years in drywall installation</dt>
            <dd className="draw-fade mt-6" style={{ ["--d" as string]: 900 }}>
              <span className="display block text-[clamp(3.6rem,6vw,5.6rem)] leading-none">
                <Confirm note="Their 2006 copy says over 20 years; the real number is likely higher.">
                  {business.years.drywall.value}
                </Confirm>
              </span>
              <span className="annot mt-4 block text-muted">Years in drywall installation</span>
            </dd>
          </div>
          <div>
            <DimLine d={650} />
            <dt className="sr-only">Signature ceiling designs</dt>
            <dd className="draw-fade mt-6" style={{ ["--d" as string]: 1050 }}>
              <span className="display block text-[clamp(3.6rem,6vw,5.6rem)] leading-none">6</span>
              <span className="annot mt-4 block text-muted">Signature ceiling designs</span>
            </dd>
          </div>
          <div>
            <DimLine d={800} />
            <dt className="sr-only">Ceilings to floors</dt>
            <dd className="draw-fade mt-6" style={{ ["--d" as string]: 1200 }}>
              <span className="display block text-[clamp(3.6rem,6vw,5.6rem)] leading-none">
                <span className="text-red">+</span>&thinsp;Floors
              </span>
              <span className="annot mt-4 block text-muted">Ceilings to floors, now with epoxy coatings</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
