// Epoxy finish options. All three are unconfirmed for Ashton, so every label
// renders with a visible {{CONFIRM}} token in the UI.

export type Finish = "solid" | "flake" | "metallic";

export const FINISHES: { id: Finish; label: string; note: string; swatch: string }[] = [
  { id: "solid", label: "Solid", note: "Solid color", swatch: "/textures/e1-solid.webp" },
  { id: "flake", label: "Flake", note: "Decorative flake / chip", swatch: "/textures/e2-flake.webp" },
  { id: "metallic", label: "Metallic", note: "Metallic marble", swatch: "/textures/e3-metallic.webp" },
];

export const FINISH_WEIGHTS: Record<Finish, [number, number, number]> = {
  solid: [1, 0, 0],
  flake: [0, 1, 0],
  metallic: [0, 0, 1],
};

export const SPACES = ["Garages", "Basements", "Workshops", "Commercial floors"];

// Deterministic chip layout for the CSS "broadcast" fallback (no Math.random
// during render: positions come from a seeded generator at module load).
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(20261023);
const CHIP_COLORS = ["#161616", "#2c2b2a", "#6e6c69", "#9b9995", "#eeebe5"];

export const CHIPS = Array.from({ length: 54 }, () => ({
  x: +(rnd() * 100).toFixed(2),
  y: +(rnd() * 100).toFixed(2),
  s: +(5 + rnd() * 10).toFixed(1),
  r: Math.round(rnd() * 180),
  c: CHIP_COLORS[Math.floor(rnd() * CHIP_COLORS.length)],
  d: +(rnd() * 0.9).toFixed(2),
}));
