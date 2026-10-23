// The six services from the brief. Descriptions are plain statements of what
// the service is, with no claims beyond what the owner gave us.

export type ServiceVisual =
  | { kind: "photo"; photoId: string }
  | { kind: "swatch"; src: string; alt: string }
  | { kind: "swatches"; items: { src: string; alt: string }[] };

export type Service = {
  id: string;
  name: string;
  description: string;
  isNew?: boolean;
  visual: ServiceVisual;
};

export const services: Service[] = [
  {
    id: "drywall",
    name: "Drywall Installation & Finishing",
    description: "Board hung, taped, mudded and sanded smooth, ready for paint.",
    visual: { kind: "photo", photoId: "drywall2" },
  },
  {
    id: "decorative",
    name: "Decorative Ceiling & Wall Design",
    description: "Trays, tracks, medallions, arches and panels, designed for your room.",
    visual: { kind: "photo", photoId: "dbloct2" },
  },
  {
    id: "painting",
    name: "Interior Painting",
    description: "Walls, ceilings and trim, with windows and tubs covered before the first coat.",
    visual: { kind: "photo", photoId: "paint1" },
  },
  {
    id: "texture",
    name: "Textured Finishes",
    description: "Knock-down texture for walls and ceilings.",
    visual: {
      kind: "swatch",
      src: "/textures/e5-knockdown.webp",
      alt: "Illustrative render of a white knock-down drywall texture.",
    },
  },
  {
    id: "trim",
    name: "Trim, Wainscoting & Finish Carpentry",
    description: "Chair rail, base, wainscoting and the finish details that frame a room.",
    visual: { kind: "photo", photoId: "18" },
  },
  {
    id: "epoxy",
    name: "Epoxy Floor Coatings",
    description: "A new service: coated floors, finished with the same care as the ceiling above.",
    isNew: true,
    visual: {
      kind: "swatches",
      items: [
        { src: "/textures/e1-solid.webp", alt: "Illustrative render of a solid satin gray epoxy floor." },
        { src: "/textures/e2-flake.webp", alt: "Illustrative render of a decorative flake epoxy floor." },
        { src: "/textures/e3-metallic.webp", alt: "Illustrative render of a metallic marbled epoxy floor." },
      ],
    },
  },
];
