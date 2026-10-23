// Every real fact about the business lives here, copied from the brief.
// Anything we do not know is marked `confirm: true` and renders as a
// visible {{CONFIRM}} token. Never add a fact here that the owner did not give us.

export const business = {
  legalName: "Ashton Innovations Drywall & Painting Inc.",
  brand: "Ashton Innovations",
  tagline: "Taking Drywall To The Next Level",
  positioning: "Drywall by design.",
  homeStyles: ["Colonials", "Victorians", "Contemporaries"],
  phone: {
    display: "(540) 374-9366",
    href: "tel:+15403749366",
  },
  mailing: {
    line1: "PO Box 133",
    line2: "Hartwood, VA 22471",
  },
  serviceArea: ["Fredericksburg", "Stafford", "Spotsylvania"],
  serviceRegion: "Virginia",
  // Their own copy dates from about 2006, so the real numbers are probably higher.
  years: {
    drywall: { value: "20+", confirm: true },
    decorative: { value: "15+", confirm: true },
  },
  conceptCredit:
    "Concept preview by Lee Enterprises Unlimited. Illustrative renders are AI-generated.",
} as const;

export const CTA_LABEL = "Request a Design Consultation";

export const ceilingDesignNames = [
  "Sculptured Ceilings",
  "Tray Ceilings",
  "Raised Panels",
  "Track Ceilings",
  "Light Medallions",
  "Arches",
] as const;

export const projectTypes = [
  ...ceilingDesignNames,
  "Drywall",
  "Painting",
  "Epoxy Floor",
  "Not sure",
] as const;

export type ProjectType = (typeof projectTypes)[number];

export const navLinks = [
  { label: "Ceilings", href: "/#ceilings" },
  { label: "Process", href: "/#process" },
  { label: "Epoxy Floors", href: "/#epoxy" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/contact" },
] as const;
