import type { PhotoGroup } from "./photos";

export type CeilingDesign = {
  slug: string;
  name: string;
  sheet: string;
  scale: string;
  view: "Section" | "Elevation" | "Plan" | "Plan + section";
  line: string;
  group: PhotoGroup;
  lead: string; // photo id shown as the main print
};

// The six signature designs Ashton lists. Descriptions explain the design type;
// they make no claims about specific jobs.
export const ceilingDesigns: CeilingDesign[] = [
  {
    slug: "sculptured",
    name: "Sculptured Ceilings",
    sheet: "A-2",
    scale: "1:24",
    view: "Section",
    line: "Stepped drywall soffits that turn a flat ceiling into layered architecture.",
    group: "sculptured",
    lead: "sculptured",
  },
  {
    slug: "tray",
    name: "Tray Ceilings",
    sheet: "A-3",
    scale: "1:24",
    view: "Section",
    line: "A recessed center that lifts the room, with space for cove light and crown.",
    group: "tray",
    lead: "01",
  },
  {
    slug: "raised",
    name: "Raised Panels",
    sheet: "A-4",
    scale: "1:24",
    view: "Elevation",
    line: "Shadow-line panels that give walls the depth of millwork.",
    group: "raised",
    lead: "18",
  },
  {
    slug: "track",
    name: "Track Ceilings",
    sheet: "A-5",
    scale: "1:48",
    view: "Plan",
    line: "Single and double lines that trace the room and frame the fixture.",
    group: "track",
    lead: "dbloct2",
  },
  {
    slug: "medallions",
    name: "Light Medallions",
    sheet: "A-6",
    scale: "1:12",
    view: "Plan + section",
    line: "Layered drywall frames that make a light fixture the center of the room.",
    group: "medallions",
    lead: "20",
  },
  {
    slug: "arches",
    name: "Arches",
    sheet: "A-7",
    scale: "1:24",
    view: "Elevation",
    line: "Soft curves for doorways, openings and niches, built true and finished smooth.",
    group: "arches",
    lead: "arch3",
  },
];
