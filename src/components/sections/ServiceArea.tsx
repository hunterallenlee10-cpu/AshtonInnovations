"use client";

import { useRef, type CSSProperties } from "react";
import { useDrawOnView } from "@/lib/useDrawOnView";
import { business } from "@/data/business";

/*
  Schematic ink-line map. Equirectangular projection of approximate real
  coordinates (x ~ lon * cos 38.3deg, y ~ -lat). Not a survey: labelled
  "Schematic map", no scale bar.
*/

const LON0 = -77.72;
const LAT0 = 38.52;
const K = 1000;
const COS = Math.cos((38.3 * Math.PI) / 180);
const PAD = 20;

const P = (lat: number, lon: number): [number, number] => [
  +((lon - LON0) * COS * K + PAD).toFixed(1),
  +((LAT0 - lat) * K + PAD).toFixed(1),
];

const line = (pts: [number, number][]) => {
  const xy = pts.map(([la, lo]) => P(la, lo));
  // smooth with quadratic midpoints so the river reads as a river
  let d = `M${xy[0][0]} ${xy[0][1]}`;
  for (let i = 1; i < xy.length - 1; i++) {
    const [x, y] = xy[i];
    const [nx, ny] = xy[i + 1];
    d += ` Q${x} ${y} ${((x + nx) / 2).toFixed(1)} ${((y + ny) / 2).toFixed(1)}`;
  }
  const last = xy[xy.length - 1];
  return d + ` L${last[0]} ${last[1]}`;
};

const RIVER = line([
  [38.505, -77.715],
  [38.47, -77.66],
  [38.43, -77.62],
  [38.39, -77.585],
  [38.36, -77.55],
  [38.335, -77.51],
  [38.315, -77.475],
  [38.3, -77.452],
  [38.285, -77.43],
  [38.26, -77.39],
  [38.23, -77.35],
  [38.19, -77.31],
  [38.14, -77.27],
]);

const I95 = line([
  [38.52, -77.335],
  [38.47, -77.37],
  [38.42, -77.42],
  [38.36, -77.46],
  [38.31, -77.5],
  [38.27, -77.515],
  [38.2, -77.53],
  [38.12, -77.55],
]);

const CITY = (() => {
  const pts = [
    P(38.335, -77.5),
    P(38.33, -77.452),
    P(38.285, -77.44),
    P(38.272, -77.49),
  ];
  return `M${pts.map((p) => p.join(" ")).join(" L")} Z`;
})();

const places = [
  { name: "Fredericksburg", at: P(38.303, -77.461), dx: -14, dy: 4, anchor: "end" as const },
  { name: "Stafford", at: P(38.422, -77.408), dx: 14, dy: 4, anchor: "start" as const },
  { name: "Spotsylvania", at: P(38.2, -77.588), dx: 14, dy: 4, anchor: "start" as const },
];
const HARTWOOD = P(38.4, -77.555);

export function ServiceArea() {
  const svgRef = useRef<SVGSVGElement>(null);
  useDrawOnView(svgRef, { threshold: 0.2 });
  // CSS line drawing (globals.css .draw / .draw-fade): always visible under reduced motion
  const draw = (delay: number) => ({
    className: "draw",
    pathLength: 1,
    style: { ["--d" as string]: Math.round(delay * 1000) } as CSSProperties,
  });
  const fade = (delay: number) => ({
    className: "draw-fade",
    style: { ["--d" as string]: Math.round(delay * 1000) } as CSSProperties,
  });

  return (
    <section
      id="area"
      data-nav-theme="light"
      aria-labelledby="area-title"
      className="plaster-surface relative py-[clamp(96px,14vw,200px)] text-ink"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-x-[clamp(32px,6vw,120px)] gap-y-16 px-[var(--gutter)] lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 id="area-title" className="display text-[clamp(3rem,7vw,6.4rem)]">
            Where we work
          </h2>
          <ul className="mt-10 border-b border-line-strong">
            {business.serviceArea.map((t) => (
              <li key={t} className="display border-t border-line-strong py-4 text-[clamp(2rem,3.6vw,3.2rem)] leading-none">
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[17px] text-muted">{business.serviceRegion}</p>

          <dl className="mt-12 grid gap-8 sm:grid-cols-2">
            <div>
              <dt className="annot text-muted">Office</dt>
              <dd className="mt-2">
                <a
                  href={business.phone.href}
                  className="inline-flex min-h-11 items-center text-[20px] tabular-nums underline decoration-red decoration-1 underline-offset-[6px]"
                >
                  {business.phone.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="annot text-muted">Mailing</dt>
              <dd className="mt-3 text-[17px] leading-relaxed">
                {business.mailing.line1}
                <br />
                {business.mailing.line2}
              </dd>
            </div>
          </dl>
        </div>

        <figure className="relative">
          <div className="relative border border-line-strong bg-plaster/60 p-[clamp(12px,2vw,24px)]">
            <div className="blueprint-grid blueprint-grid-faint pointer-events-none absolute inset-0" aria-hidden="true" />
            <svg ref={svgRef}
              viewBox="0 0 400 440"
              className="relative block h-auto w-full"
              role="img"
              aria-label="Schematic map of the service area: Stafford to the north, Fredericksburg on the Rappahannock River, and Spotsylvania to the southwest, with Hartwood, the mailing address, in western Stafford."
            >
              <g fill="none" stroke="var(--ink)" strokeLinecap="round" strokeLinejoin="round">
                {/* river: double line */}
                <path d={RIVER} strokeWidth={5} strokeOpacity={0.9} {...draw(0)} />
                <path d={RIVER} strokeWidth={2.6} stroke="var(--plaster)" />
                {/* I-95 */}
                <path d={I95} strokeWidth={1.2} strokeOpacity={0.7} {...draw(0.4)} />
                <path d={I95} strokeWidth={0.8} strokeOpacity={0.5} strokeDasharray="6 5" transform="translate(4 1)" {...fade(1.2)} />
                {/* Fredericksburg city edge */}
                <path d={CITY} strokeWidth={0.9} strokeOpacity={0.55} strokeDasharray="3 4" {...fade(1.4)} />
              </g>

              {/* labels */}
              <g className="font-mono" fill="var(--ink)" style={{ letterSpacing: "0.12em" }}>
                <text x={P(38.47, -77.55)[0]} y={P(38.47, -77.55)[1]} fontSize={9.5} fillOpacity={0.55} {...fade(1.6)}>
                  STAFFORD CO.
                </text>
                <text x={P(38.15, -77.7)[0]} y={P(38.15, -77.7)[1]} fontSize={9.5} fillOpacity={0.55} {...fade(1.6)}>
                  SPOTSYLVANIA CO.
                </text>
                <text
                  fontSize={8.5}
                  fillOpacity={0.6}
                  transform={`translate(${P(38.452, -77.66).join(" ")}) rotate(48)`}
                  {...fade(1.8)}
                >
                  RAPPAHANNOCK RIVER
                </text>
                <text x={P(38.505, -77.33)[0] - 6} y={P(38.505, -77.33)[1]} fontSize={9} fillOpacity={0.7} textAnchor="end" {...fade(1.8)}>
                  I-95
                </text>
              </g>

              {/* places */}
              {places.map((pl, i) => (
                <g key={pl.name} {...fade(1.9 + i * 0.15)}>
                  <circle cx={pl.at[0]} cy={pl.at[1]} r={11} fill="none" stroke="var(--red)" strokeOpacity={0.35} />
                  <circle cx={pl.at[0]} cy={pl.at[1]} r={4.6} fill="var(--red)" />
                  <text
                    x={pl.at[0] + pl.dx}
                    y={pl.at[1] + pl.dy}
                    textAnchor={pl.anchor}
                    fontSize={11.5}
                    className="font-mono"
                    style={{ letterSpacing: "0.12em" }}
                    fill="var(--ink)"
                  >
                    {pl.name.toUpperCase()}
                  </text>
                </g>
              ))}
              <g {...fade(2.4)}>
                <circle cx={HARTWOOD[0]} cy={HARTWOOD[1]} r={4.6} fill="var(--plaster)" stroke="var(--red)" strokeWidth={1.6} />
                <text x={HARTWOOD[0] - 12} y={HARTWOOD[1] - 2} textAnchor="end" fontSize={10.5} className="font-mono" fill="var(--ink)" style={{ letterSpacing: "0.12em" }}>
                  HARTWOOD
                </text>
                <text x={HARTWOOD[0] - 12} y={HARTWOOD[1] + 11} textAnchor="end" fontSize={8.5} fillOpacity={0.6} className="font-mono" fill="var(--ink)" style={{ letterSpacing: "0.12em" }}>
                  MAILING
                </text>
              </g>

              {/* north arrow */}
              <g transform="translate(366 46)" fill="none" stroke="var(--ink)" strokeWidth={1}>
                <path d="M0 18 V-14 M-6 -6 L0 -14 L6 -6" />
                <text x={0} y={34} textAnchor="middle" fontSize={10} stroke="none" fill="var(--ink)" className="font-mono">
                  N
                </text>
              </g>
            </svg>
          </div>
          <figcaption className="mt-3 flex flex-wrap justify-between gap-2">
            <span className="annot text-muted">Schematic map, not to scale</span>
            <span className="annot text-muted">
              <span aria-hidden="true" className="mr-2 inline-block size-2 translate-y-[-1px] rounded-full bg-red" />
              Service area
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
