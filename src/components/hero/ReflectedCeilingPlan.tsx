// Reflected ceiling plan of the hero tray. Coordinates are measured from the
// hero keyframes (1920x1080), so when the canvas fades in, these lines sit on
// top of the real framing: the drawing becomes the structure.

type Oct = { cx: number; cy: number; a: number; b: number; c: number };

const octPoints = ({ cx, cy, a, b, c }: Oct, inset = 0) => {
  const A = a - inset;
  const B = b - inset;
  const C = Math.max(0, c - inset * 0.4142);
  return [
    [cx - A + C, cy - B],
    [cx + A - C, cy - B],
    [cx + A, cy - B + C],
    [cx + A, cy + B - C],
    [cx + A - C, cy + B],
    [cx - A + C, cy + B],
    [cx - A, cy + B - C],
    [cx - A, cy - B + C],
  ]
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
};

const OUTER: Oct = { cx: 957.5, cy: 557.5, a: 722.5, b: 422.5, c: 170 };
const INNER: Oct = { cx: 957.5, cy: 542.5, a: 537.5, b: 277.5, c: 118 };
const COVE: Oct = { cx: 957.5, cy: 542.5, a: 492.5, b: 242.5, c: 95 };
const MED = { x: 958, y: 544 };

function Tick({ x, y, d }: { x: number; y: number; d: number }) {
  return <path className="rcp-line" pathLength={1} style={{ ["--d" as string]: d }} d={`M${x - 9} ${y + 9} L${x + 9} ${y - 9}`} />;
}

function Plan() {
  return (
    <>
      {/* room perimeter (wall thickness) */}
      <rect className="rcp-line" pathLength={1} style={{ ["--d" as string]: 0 }} x={80} y={40} width={1760} height={1010} />
      <rect className="rcp-line rcp-dim" pathLength={1} style={{ ["--d" as string]: 120 }} x={100} y={60} width={1720} height={970} />

      {/* outer tray: edge + crown moulding band */}
      <polygon className="rcp-line rcp-key" pathLength={1} style={{ ["--d" as string]: 260 }} points={octPoints(OUTER)} />
      <polygon className="rcp-line rcp-dim" pathLength={1} style={{ ["--d" as string]: 420 }} points={octPoints(OUTER, 16)} />
      <polygon className="rcp-line rcp-dim" pathLength={1} style={{ ["--d" as string]: 520 }} points={octPoints(OUTER, 34)} />

      {/* inner tray */}
      <polygon className="rcp-line rcp-key" pathLength={1} style={{ ["--d" as string]: 640 }} points={octPoints(INNER)} />
      <polygon className="rcp-line rcp-dim" pathLength={1} style={{ ["--d" as string]: 780 }} points={octPoints(INNER, 14)} />

      {/* LED cove: hidden line */}
      <polygon className="rcp-fade rcp-hidden" style={{ ["--d" as string]: 980 }} points={octPoints(COVE)} />

      {/* light medallion */}
      <circle className="rcp-line rcp-key" pathLength={1} style={{ ["--d" as string]: 1000 }} cx={MED.x} cy={MED.y} r={105} />
      <circle className="rcp-line rcp-dim" pathLength={1} style={{ ["--d" as string]: 1080 }} cx={MED.x} cy={MED.y} r={72} />
      <circle className="rcp-line" pathLength={1} style={{ ["--d" as string]: 1160 }} cx={MED.x} cy={MED.y} r={22} />
      {Array.from({ length: 8 }, (_, i) => {
        const t = (i * Math.PI) / 4;
        return (
          <path
            key={i}
            className="rcp-line rcp-dim"
            pathLength={1}
            style={{ ["--d" as string]: 1180 + i * 20 }}
            d={`M${(MED.x + Math.cos(t) * 26).toFixed(1)} ${(MED.y + Math.sin(t) * 26).toFixed(1)} L${(MED.x + Math.cos(t) * 68).toFixed(1)} ${(MED.y + Math.sin(t) * 68).toFixed(1)}`}
          />
        );
      })}

      {/* centre lines */}
      <path className="rcp-fade rcp-center" style={{ ["--d" as string]: 1250 }} d={`M${MED.x} 70 V1020 M110 ${MED.y} H1810`} />

      {/* dimensions */}
      <g>
        <path className="rcp-line rcp-dim" pathLength={1} style={{ ["--d" as string]: 1350 }} d="M235 80 V128 M1680 80 V128 M222 98 H1693" />
        <Tick x={235} y={98} d={1450} />
        <Tick x={1680} y={98} d={1450} />
        <path className="rcp-line rcp-dim" pathLength={1} style={{ ["--d" as string]: 1400 }} d="M150 135 H228 M150 980 H228 M168 122 V993" />
        <Tick x={168} y={135} d={1500} />
        <Tick x={168} y={980} d={1500} />
        <path className="rcp-line rcp-dim" pathLength={1} style={{ ["--d" as string]: 1450 }} d="M420 828 V1010 M1495 828 V1010 M407 996 H1508" />
        <Tick x={420} y={996} d={1550} />
        <Tick x={1495} y={996} d={1550} />
      </g>

      {/* section cut marker */}
      <g className="rcp-fade" style={{ ["--d" as string]: 1600 }}>
        <circle className="rcp-line rcp-static" cx={1868} cy={557} r={30} />
        <path className="rcp-line rcp-static" d="M1838 557 H1898 M1760 557 H1838" />
      </g>

      {/* labels (hidden on small screens via CSS) */}
      <g className="rcp-labels rcp-fade" style={{ ["--d" as string]: 1700 }}>
        <text x={957.5} y={70} textAnchor="middle">16&apos;-0&quot;</text>
        <text x={957.5} y={1042} textAnchor="middle">12&apos;-6&quot; INNER TRAY</text>
        <text x={132} y={560} textAnchor="middle" transform="rotate(-90 132 560)">11&apos;-0&quot;</text>
        <text x={1868} y={552} textAnchor="middle" className="rcp-small">A</text>
        <text x={1868} y={575} textAnchor="middle" className="rcp-small">A-3</text>

        <path className="rcp-line rcp-static" d="M318 222 L262 176 H118" />
        <text x={120} y={168}>CROWN MOULDING, TYP.</text>

        <path className="rcp-line rcp-static" d="M1300 300 L1372 222 H1560" />
        <text x={1378} y={214}>LED COVE, HIDDEN</text>

        <path className="rcp-line rcp-static" d="M1046 604 L1110 668 H1330" />
        <text x={1116} y={660}>LIGHT MEDALLION</text>

        <g>
          <rect className="rcp-line rcp-static" x={566} y={154} width={128} height={30} />
          <text x={630} y={175} textAnchor="middle">CLG +10&apos;-0&quot;</text>
          <rect className="rcp-line rcp-static" x={566} y={322} width={128} height={30} />
          <text x={630} y={343} textAnchor="middle">TRAY +11&apos;-6&quot;</text>
        </g>
      </g>
    </>
  );
}

export function ReflectedCeilingPlan({ className = "" }: { className?: string }) {
  return (
    <div className={`rcp pointer-events-none ${className}`} aria-hidden="true">
      {/* landscape */}
      <svg className="rcp-land absolute inset-0 h-full w-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <Plan />
      </svg>
      {/* portrait: the same plan turned 90 degrees clockwise, matching the portrait frames */}
      <svg className="rcp-port absolute inset-0 h-full w-full" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
        <g transform="translate(1080 0) rotate(90)">
          <Plan />
        </g>
      </svg>
    </div>
  );
}
