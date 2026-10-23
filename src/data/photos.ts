// Real Ashton project photos. Captions are transcribed from the handwriting
// on the original prints (spelling normalised). Never put an AI render here.

export type PhotoGroup =
  | "sculptured"
  | "medallions"
  | "raised"
  | "track"
  | "tray"
  | "arches"
  | "drywall"
  | "painting"
  | "crew";

export type Photo = {
  id: string;
  src: string;
  caption: string;
  group: PhotoGroup;
  alt: string;
  width: number;
  height: number;
};

const sq = (id: string, group: PhotoGroup, caption: string, alt: string): Photo => ({
  id,
  src: `/work/${id}.jpg`,
  caption,
  group,
  alt,
  width: 1400,
  height: 1400,
});

export const photos: Photo[] = [
  sq("12", "sculptured", "Sculptured Ceiling With Single Arch", "Sculptured ceiling with layered crown moulding above a wall with a single recessed arch."),
  sq("sculptured", "sculptured", "Sculptured Ceiling w/ Brass Inlay", "Stepped sculptured ceiling painted grey with a thin brass inlay line following the steps."),
  sq("21", "sculptured", "Sculptured Corner Ceiling With Light Medallion", "Sculptured corner ceiling with a recessed panel and a brass chandelier on a light medallion."),
  sq("dd3", "sculptured", "Long View Sculptured Ceiling", "Long view of a sculptured ceiling framed by two white columns, with a chandelier beyond."),
  sq("20", "medallions", "Two Layer Light Medallion", "Two-layer square light medallion on a ceiling, with a brass and glass chandelier hanging from it."),
  sq("19", "medallions", "Two Layer With Reveal Light Medallion", "Two-layer light medallion with a reveal between layers and a slender pendant light at its centre."),
  sq("medalion", "medallions", "8 Sided Two Layer Light Medallion", "Eight-sided, two-layer light medallion with a crystal chandelier."),
  sq("10", "raised", "Raised Panels", "Wall with raised drywall panels below a chair rail and crown moulding."),
  sq("18", "raised", "Raised Panels", "Raised panels running along a dining room wall above a hardwood floor."),
  sq("16", "raised", "Raised Panel Below Window", "Raised panel detail set into the wall below a row of windows."),
  sq("14", "raised", "Triple Arched Wall", "Dining room wall with three recessed arches behind a china cabinet and chandelier."),
  sq("09", "track", "Single Track", "Ceiling with a single octagonal track line around a central light fixture."),
  sq("35", "track", "Double Track", "Ceiling with a double track line and a ceiling fan at its centre."),
  sq("28", "track", "Double Track Ceiling", "Double track ceiling lines following the room's clipped corners."),
  sq("24", "track", "Double Track Octagon", "Double track lines forming an octagon on a flat ceiling."),
  sq("dbloct1", "track", "Double Layer Octagon", "Double-layer octagon ceiling detail with an octagonal medallion and ceiling fan."),
  sq("dbloct2", "track", "Double Layer Octagon with Sky in the Center", "Double-layer octagon ceiling with a painted blue sky at its centre."),
  sq("01", "tray", "Tray Ceiling with Light Medallion", "Octagonal tray ceiling with recessed lights and a brass chandelier on a light medallion."),
  sq("04", "tray", "Tray Ceiling with Arched Doorway", "Tray ceiling above a hallway with an arched doorway leading into the next room."),
  sq("02", "tray", "Tray Ceiling", "Tray ceiling with long angled steps seen from below."),
  sq("arch1", "arches", "Single Arch", "Single drywall arch opening onto a hallway."),
  sq("arch2", "arches", "Arch", "Wide arch framing a white double door."),
  sq("arch3", "arches", "Stepped in Arch", "Stepped arch framing a window above a soaking tub."),
  sq("drywall1", "drywall", "Covering Fireplace with Protective Plastic", "Ashton crew member in a hard hat covering a fireplace opening with protective plastic."),
  sq("drywall2", "drywall", "Taping Light Boxes Prior to Finishing", "Ashton crew member in a hard hat taping around a light box before finishing."),
  sq("drywall3", "drywall", "A Drywall Supervisor Oversees a Point-Up Using a Light", "Ashton drywall supervisor in a hard hat holding a light to a wall while a crew member points up."),
  sq("drywall4", "drywall", "Solid Standing Walls Are Sanded After Primer", "Ashton crew member in a hard hat sanding a primed wall with a pole sander."),
  sq("drywall5", "drywall", "Cleaning Garden Tub of Debris After Install", "Ashton crew member in a hard hat cleaning debris out of a garden tub after installation."),
  sq("drywall6", "drywall", "Sealing Tub / Shower with Protective Plastic", "Ashton crew member in a hard hat sealing a tub and shower opening with protective plastic."),
  sq("paint1", "painting", "Windows Are Covered in Plastic Prior to Paint", "Ashton painter masking a window with plastic before painting."),
  sq("paint2", "painting", "Tubs Are Covered in Plastic Prior to Paint", "Ashton painter covering a tub with plastic before painting."),
  sq("paint3", "painting", "Painting Exterior Trim and Columns", "Ashton painter in a hard hat painting exterior trim beside a garage."),
  sq("paint4", "painting", "Painting Exterior Columns", "Ashton painter in a hard hat painting an exterior column from a ladder."),
  {
    id: "truck",
    src: "/work/truck.jpg",
    caption: "Ashton Truck on Site",
    group: "crew",
    alt: "Ashton Innovations work truck parked at a house under construction.",
    width: 1400,
    height: 1326,
  },
];

export const photoById = (id: string): Photo => {
  const p = photos.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown photo ${id}`);
  return p;
};

export const photosByGroup = (g: PhotoGroup) => photos.filter((p) => p.group === g);
