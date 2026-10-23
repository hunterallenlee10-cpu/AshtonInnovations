// Blueprint drawings for the six signature designs. Every path uses
// pathLength=1 + .draw, so they line-draw when an ancestor gets data-drawn.
// viewBox 520 x 300 for all of them.

import type { ReactNode } from "react";

type P = { d: string; c?: string; t?: number };

function Lines({ paths }: { paths: P[] }) {
  return (
    <>
      {paths.map((p, i) => (
        <path key={i} className={`draw ${p.c ?? ""}`} pathLength={1} style={{ ["--d" as string]: p.t ?? i * 60 }} d={p.d} />
      ))}
    </>
  );
}

function Label({ x, y, children, anchor = "start", t = 1200 }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; t?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="draw-fade" style={{ ["--d" as string]: t }}>
      {children}
    </text>
  );
}

function Frame({ children, title }: { children: ReactNode; title: string }) {
  return (
    <svg viewBox="0 0 520 300" className="ink-lines h-auto w-full overflow-visible" role="img" aria-label={title}>
      {children}
    </svg>
  );
}

// small 45-degree dimension tick
const tick = (x: number, y: number) => `M${x - 5} ${y + 5} L${x + 5} ${y - 5}`;

export function SculpturedProfile() {
  return (
    <Frame title="Section drawing of a sculptured ceiling with stepped soffits on both sides.">
      <Lines
        paths={[
          { d: "M10 40 H510", c: "k", t: 0 },
          { d: "M20 40 V290 M500 40 V290", c: "k", t: 80 },
          { d: "M20 120 H88 V96 H136 V72 H182 V40", c: "k", t: 240 },
          { d: "M500 120 H432 V96 H384 V72 H338 V40", c: "k", t: 240 },
          { d: "M20 134 Q20 120 34 120 M500 134 Q500 120 486 120", t: 520 },
          { d: "M30 120 L44 106 M48 120 L62 106 M66 120 L80 106 M98 96 L112 82 M116 96 L130 82 M146 72 L160 58 M164 72 L176 60", c: "l", t: 620 },
          { d: "M440 120 L454 106 M458 120 L472 106 M476 120 L490 106 M392 96 L406 82 M410 96 L424 82 M346 72 L360 58 M362 72 L376 60", c: "l", t: 620 },
          { d: "M88 168 V150 M432 168 V150 M80 160 H440", c: "l", t: 820 },
          { d: tick(88, 160) + tick(432, 160), c: "l", t: 900 },
          { d: "M182 40 V24 M338 40 V24 M174 30 H346", c: "l", t: 900 },
        ]}
      />
      <Label x={260} y={182} anchor="middle">STEPPED SOFFIT, TYP. BOTH SIDES</Label>
      <Label x={260} y={18} anchor="middle">RAISED FIELD</Label>
      <Label x={34} y={232}>WALL</Label>
    </Frame>
  );
}

export function TrayProfile() {
  return (
    <Frame title="Section drawing of a two-step tray ceiling with a cove light ledge and a center fixture.">
      <Lines
        paths={[
          { d: "M20 290 V196 H120 V146 H182 V84 H338 V146 H400 V196 H500 V290", c: "k", t: 0 },
          { d: "M20 210 Q20 196 34 196 M500 210 Q500 196 486 196 M120 160 Q120 146 134 146 M400 160 Q400 146 386 146", t: 420 },
          { d: "M182 116 H204 V110 M338 116 H316 V110", t: 560 },
          { d: "M200 106 Q228 92 258 86 M320 106 Q292 92 262 86", c: "r dash", t: 820 },
          { d: "M260 84 V100 M244 116 Q260 128 276 116 M244 116 H276 M252 116 V126 M268 116 V126", t: 900 },
          { d: "M480 196 V84 M470 196 H490 M470 146 H490 M470 84 H490", c: "l", t: 1000 },
        ]}
      />
      <circle className="draw" pathLength={1} style={{ ["--d" as string]: 880 }} cx={260} cy={84} r={9} />
      <Label x={260} y={70} anchor="middle">MEDALLION</Label>
      <Label x={150} y={104} anchor="end" t={1300}>LED COVE</Label>
      <Label x={70} y={186} anchor="middle">CLG</Label>
      <Label x={151} y={138} anchor="middle">STEP 1</Label>
      <Label x={226} y={78} anchor="middle" t={1350}>STEP 2</Label>
    </Frame>
  );
}

export function RaisedPanelProfile() {
  const panel = (x: number, y: number, w: number, h: number) =>
    `M${x} ${y} H${x + w} V${y + h} H${x} Z M${x + 9} ${y + 9} H${x + w - 9} V${y + h - 9} H${x + 9} Z`;
  return (
    <Frame title="Wall elevation with raised drywall panels above and below a chair rail.">
      <Lines
        paths={[
          { d: "M10 286 H510", c: "k", t: 0 },
          { d: "M20 30 H500 M20 44 H500", c: "k", t: 80 },
          { d: "M20 146 H500 M20 156 H500", c: "k", t: 160 },
          { d: "M20 262 H500", t: 220 },
          { d: panel(40, 60, 210, 70), t: 360 },
          { d: panel(270, 60, 210, 70), t: 440 },
          { d: panel(40, 174, 134, 72), t: 520 },
          { d: panel(193, 174, 134, 72), t: 600 },
          { d: panel(346, 174, 134, 72), t: 680 },
          { d: "M251 69 V131 H49 M481 69 V131 H279 M175 183 V247 H49 M328 183 V247 H202 M481 183 V247 H355", c: "k", t: 900 },
        ]}
      />
      <Label x={510} y={26} anchor="end">CROWN</Label>
      <Label x={510} y={142} anchor="end">CHAIR RAIL</Label>
      <Label x={510} y={280} anchor="end">BASE</Label>
    </Frame>
  );
}

export function TrackProfile() {
  const oct = (i: number) => {
    const x0 = 20 + i, x1 = 500 - i, y0 = 20 + i, y1 = 280 - i, c = 46;
    return `M${x0 + c} ${y0} H${x1 - c} L${x1} ${y0 + c} V${y1 - c} L${x1 - c} ${y1} H${x0 + c} L${x0} ${y1 - c} V${y0 + c} Z`;
  };
  return (
    <Frame title="Reflected ceiling plan with a double track line following the room's clipped corners.">
      <Lines
        paths={[
          { d: "M20 20 H500 V280 H20 Z", c: "k", t: 0 },
          { d: oct(30), c: "k", t: 280 },
          { d: oct(44), t: 420 },
          { d: oct(92), c: "l dash", t: 620 },
          { d: "M260 128 V172 M238 150 H282", c: "l", t: 800 },
        ]}
      />
      <circle className="draw" pathLength={1} style={{ ["--d" as string]: 760 }} cx={260} cy={150} r={12} />
      <Label x={260} y={44} anchor="middle">DOUBLE TRACK</Label>
      <Label x={260} y={118} anchor="middle" t={1300}>FIXTURE</Label>
    </Frame>
  );
}

export function MedallionProfile() {
  const oct = (cx: number, cy: number, r: number) => {
    const c = r * 0.4142;
    return `M${cx - c} ${cy - r} H${cx + c} L${cx + r} ${cy - c} V${cy + c} L${cx + c} ${cy + r} H${cx - c} L${cx - r} ${cy + c} V${cy - c} Z`;
  };
  return (
    <Frame title="Plan and section of a two-layer light medallion with a chandelier.">
      <Lines
        paths={[
          { d: oct(130, 150, 110), c: "k", t: 0 },
          { d: oct(130, 150, 78), t: 200 },
          { d: oct(130, 150, 70), c: "l", t: 260 },
          { d: "M290 30 V280", c: "l dash", t: 300 },
          { d: "M320 80 H510", c: "k", t: 360 },
          { d: "M340 80 V94 H490 V80 M370 94 V106 H460 V94", c: "k", t: 520 },
          { d: "M415 106 V160 M380 160 Q415 196 450 160 M380 160 H450 M392 160 V176 M415 160 V182 M438 160 V176", t: 720 },
        ]}
      />
      <circle className="draw" pathLength={1} style={{ ["--d" as string]: 600 }} cx={130} cy={150} r={10} />
      <Label x={130} y={290} anchor="middle">PLAN</Label>
      <Label x={415} y={290} anchor="middle">SECTION</Label>
      <Label x={500} y={70} anchor="end">LAYER 1 / LAYER 2</Label>
    </Frame>
  );
}

export function ArchProfile() {
  return (
    <Frame title="Elevation of a stepped arch opening with its spring line and radius marked.">
      <Lines
        paths={[
          { d: "M10 286 H510", c: "k", t: 0 },
          { d: "M140 286 V160 A120 120 0 0 1 380 160 V286", c: "k", t: 160 },
          { d: "M160 286 V160 A100 100 0 0 1 360 160 V286", t: 420 },
          { d: "M120 160 H400", c: "l dash", t: 700 },
          { d: "M260 160 L331 89", c: "l", t: 860 },
          { d: "M255 160 H265 M260 155 V165", t: 900 },
        ]}
      />
      <Label x={404} y={156}>SPRING LINE</Label>
      <Label x={300} y={118} t={1300}>R</Label>
      <Label x={260} y={30} anchor="middle">STEPPED RETURN</Label>
    </Frame>
  );
}

export const profileFor = {
  sculptured: SculpturedProfile,
  tray: TrayProfile,
  raised: RaisedPanelProfile,
  track: TrackProfile,
  medallions: MedallionProfile,
  arches: ArchProfile,
} as const;
