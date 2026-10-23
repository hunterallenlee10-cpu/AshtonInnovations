# Assets Plan (Phase 0)

Status: **waiting for your approval. Nothing has been generated and 0 credits are spent.**
The only Higgsfield action so far was importing the public `01.jpg` once, because the upscaler only gives a price quote against a real uploaded image.

- Balance: **1,210 credits** (Plus plan), checked 2026-10-23.
- All prices below are live `get_cost` quotes from 2026-10-23. I re-quote before each batch.
- Every generated image/video: **no text, letters, logos or watermarks; no people, hands or faces; locked or very slow camera; one motion per clip.**
- Palette in every prompt: warm plaster whites, deep near-black shadows, at most one small touch of deep crimson red. (Hex codes are kept out of prompts, since models sometimes render them as text.)
- Honesty: every generated asset ships with an `ILLUSTRATIVE RENDER` label and never appears in a real-photo gallery.

---

## Model choices (current names from `models_explore`)

| Job | Model | Why | Quoted price |
|---|---|---|---|
| Stills + reference edits | **Nano Banana 2.1** (`nano_banana_2_1`) | Google's current photoreal model with reference editing and a seed. "Nano Banana Pro" isn't listed. | 1K = 1.5, 2K = 2, 4K = 3 |
| Still fallback | GPT Image 2.5, high (`gpt_image_2_5`) | Only if Nano Banana drifts on the geometry edits | 2K = 2.75 |
| First + last frame video | **Kling 3.0** (`kling3_0`), silent | Named in the brief; first/last frame; `sound: off` | 5 s std = 7.5, 5 s pro = 8.75, 10 s pro = 17.5 |
| First + last frame video (challenger) | **Kling 4.0** (`kling4_0`), image-to-video | Newer, cheaper at 1080p, also takes start + end frames | 5 s 720p = 2.5, 5 s 1080p = 5, 10 s 1080p = 10 |
| Photo upscale | `upscale_image` (ByteDance) | The only upscaler. No creative/faithful switch, so every result is reviewed by hand | 2 per image (2K or 4K) |

**Video model decision:** a cheap A/B on Clip 1 (Kling 4.0 at 720p + Kling 3.0 std, 10 credits total). The winner on locked camera and geometry hold makes all the final clips. Estimates below use the pricier Kling 3.0 numbers; if Kling 4.0 wins, the total drops by about 22 credits.

---

## A. Real photo upscales (34 photos)

**Purpose:** Ceiling Collection, gallery modal, hero end beat (`01.jpg`), Process, Services thumbs, Selected Rooms.

**Pre-step (free, local):** each photo is a Polaroid with a white border and a handwritten caption baked in. The usable photo is only about 350x350 px. A script crops the inner photo first, so the upscaler never sees the handwriting. The truck is cropped to its circle's bounding square.

**Settings:** `upscale_image`, provider ByteDance, target 2K (about 5.8x from a 350 px crop; the smallest target available), then resampled down to about 1400 px (about 4x, inside the brief's 2-4x) for web. Saved to `/public/work/<same filename>`.

**Review rule:** a side-by-side sheet for every photo. Reject if mouldings, trim lines, chandelier arms, shirt lettering or **crew faces** changed or gained detail that wasn't there. A rejected photo uses the clean crop with a plain local resize instead.

**Estimate: 34 x 2 = 68 credits.** `splash.jpg` is brand reference only and is not upscaled.

### Photo inventory (captions transcribed from the handwriting)
Spelling is normalised for our HTML captions ("Medalion" to "Medallion", "Enlay" to "Inlay"). Everything else is their wording.

| Group | File | Their caption | Notes |
|---|---|---|---|
| Sculptured | `12.jpg` | Sculptured Ceiling With Single Arch | |
| Sculptured | `sculptured.jpg` | Sculptured Ceiling w/ Brass Inlay | gray + brass inlay |
| Sculptured | `21.jpg` | Sculptured Corner Ceiling With Light Medallion | |
| Sculptured | `dd3.jpg` | Long View Sculptured Ceiling | columns |
| Light Medallions | `20.jpg` | Two Layer Light Medallion | |
| Light Medallions | `19.jpg` | Two Layer With Reveal Light Medallion | |
| Light Medallions | `medalion.jpg` | 8 Sided Two Layer Light Medallion | |
| Raised Panels | `10.jpg` | Raised Panels | |
| Raised Panels | `18.jpg` | Raised Panels | |
| Raised Panels | `16.jpg` | Raised Panel Below Window | |
| Raised Panels | `14.jpg` | Triple Arched Wall | |
| Track Ceilings | `09.jpg` | Single Track | |
| Track Ceilings | `35.jpg` | Double Track | ceiling fan |
| Track Ceilings | `28.jpg` | Double Track Ceiling | |
| Track Ceilings | `24.jpg` | Double Track Octagon | |
| Track Ceilings | `dbloct1.jpg` | Double Layer Octagon | ceiling fan |
| Track Ceilings | `dbloct2.jpg` | Double Layer Octagon with Sky in the Center | painted sky |
| Tray Ceilings | `01.jpg` | Tray Ceiling with Light Medallion | **hero end beat**; clipped-corner tray, brass chandelier |
| Tray Ceilings | `04.jpg` | Tray Ceiling with Arched Doorway | |
| Tray Ceilings | `02.jpg` | Tray Ceiling | |
| Arches | `arch1.jpg` | Single Arch | |
| Arches | `arch2.jpg` | Arch | small "Ashton Innovations" watermark at bottom |
| Arches | `arch3.jpg` | Stepped in Arch | small watermark at bottom |
| Drywall | `drywall1.jpg` | Covering Fireplace with Protective Plastic | crew, hard hat |
| Drywall | `drywall2.jpg` | Taping Light Boxes prior to finishing | crew, hard hat |
| Drywall | `drywall3.jpg` | A drywall supervisor oversees a point-up using a light | two crew, hard hats |
| Drywall | `drywall4.jpg` | Solid standing walls are sanded after primer | crew, hard hat |
| Drywall | `drywall5.jpg` | Cleaning garden tub of debris after install | crew, hard hat |
| Drywall | `drywall6.jpg` | Sealing tub / shower with protective plastic | crew, hard hat |
| Painting | `paint1.jpg` | Windows are covered in plastic prior to paint | crew |
| Painting | `paint2.jpg` | Tubs are covered in plastic prior to paint | crew |
| Painting | `paint3.jpg` | Painting exterior trim and columns | **exterior**, crew, hard hat |
| Painting | `paint4.jpg` | Painting exterior columns | **exterior**, crew, hard hat |
| Truck | `truck.jpg` | (none) | circle crop; Ashton truck at a house under construction |
| Brand ref | `splash.jpg` | (none) | old splash page; not upscaled, not shown |

---

## B. Ceiling hero keyframes

Order matters: the finished ceiling (KF3) comes first, then KF2 and KF1 are **edits of KF3**, so the angle and geometry match exactly.

### B1. KF3 drafts: finished tray ceiling (generate first)
- Model: Nano Banana 2.1, 16:9, **1K**, 4 variants (2 prompts x 2), fixed seeds logged
- Variant set 1 uses the prompt as written (square corners). Variant set 2 swaps "rectangular" for "rectangular with crisp 45-degree clipped corners (a long octagon)", which rhymes with the real `01.jpg` the hero crossfades into.
- Prompt:
  > Architectural interior photograph taken looking straight up at the ceiling from the exact centre of an empty, elegant room. The camera points directly upward, perfectly perpendicular to the ceiling, centred one-point symmetry, no perspective tilt. A finished two-step tray ceiling: a recessed rectangular outer tray, and inside it a second, deeper rectangular tray stepping up again. Every step edge is finished with fine, crisp crown moulding. Smooth matte plaster-white finish on every surface. A warm LED cove glow washes up the inner tray from a hidden ledge, with a soft gradient fall-off. At the exact centre, a round, finely detailed plaster ceiling medallion with a simple, slender chandelier hanging from it, seen from directly below, lit with small warm bulbs. Soft natural daylight from unseen windows at the room edges, deep clean shadow in the outer corners. Calm, expensive, high-end architectural photography, ultra sharp, natural colour, warm whites and deep near-black shadows only. Photoreal. No people, no hands, no text, no letters, no numbers, no logos, no watermark.
- **GATE: you pick one draft.**
- Estimate: 4 x 1.5 = **6**

### B2. KF3 final
- `upscale_image` 4K of the chosen draft. A faithful upscale, so the final can't drift from the draft you approved (a fresh 2K/4K generation would be a different image).
- Estimate: **2**

### B3. KF2: mid-construction (edit of KF3 final)
- Model: Nano Banana 2.1, 16:9, **2K**, reference image = KF3 final, 2 candidates
- Prompt:
  > Edit the reference image. Keep exactly the same camera position, lens, framing and ceiling geometry: every tray edge, step and corner stays in exactly the same place. Change only the construction state, to the same ceiling mid-construction. Bare grey-white gypsum drywall boards screwed onto every surface of both tray steps; seams covered with paper tape and smooth wet joint compound; feathered patches of compound over the screw rows; bare metal corner bead on every step edge. No paint, no crown moulding, no cove light, no medallion, no chandelier: only an empty round electrical box at the centre. Lit by a warm portable work light from below, flat and slightly dusty, a few fine dust motes in the air. Photoreal construction photography. No people, no hands, no tools, no text, no letters, no logos, no watermark.
- Estimate: 2 x 2 = **4**

### B4. KF1: framing (edit of KF3 final)
- Model: Nano Banana 2.1, 16:9, **2K**, reference image = KF3 final, 2 candidates
- Prompt:
  > Edit the reference image. Keep exactly the same camera position, lens, framing and geometry: the framing must outline both tray steps exactly where the finished tray edges are. Change only the construction state, to before any drywall. Exposed wood framing only: parallel ceiling joists running across the frame, lumber framing and blocking that outlines both tray steps exactly where the finished steps will be, a few electrical cables stapled along the joists, an empty electrical box at the centre, the dim attic visible between the joists. Warm halogen work-light glow from below, golden on the wood, deep shadows between the joists. Photoreal construction photography. No people, no hands, no tools, no text, no letters, no logos, no watermark.
- Estimate: 2 x 2 = **4**
- After B3/B4: 50% overlay check of KF1/KF2/KF3 for edge alignment. **GATE: you approve the set.**

### B5. Portrait (9:16) versions: see question 2
- **Recommended (0 credits):** rotate the 16:9 keyframes and clips 90 degrees. Looking straight up there is no "up", so the rotated view is a true portrait view with identical geometry, and desktop and mobile can never disagree.
- **Per the brief (about 30 credits):** 3 Nano Banana 2K reference edits at 9:16 (2 candidates each, 12) + 2 portrait Kling clips (17.5).

---

## C. Ceiling hero video (two first/last-frame clips, ~5 s each, silent)

### C0. Model A/B on Clip 1
- Kling 4.0, 720p, 5 s (2.5) and Kling 3.0, std, 5 s, `sound: off` (7.5). Same frames, same prompt.
- Judge: camera stays locked, tray edges hold, no warping, no extra objects.
- Estimate: **10**

### C1. Clip 1: KF1 > KF2
- Winning model at final quality (Kling 3.0 `pro` / Kling 4.0 `1080p`), 16:9, 5 s, silent. Start frame KF1, end frame KF2.
- Prompt:
  > Locked-off static camera looking straight up at a ceiling, absolutely no camera movement. Drywall boards lift into place one after another and settle flush against the exposed wood framing of the two-step tray, then the seams are covered with tape and smooth joint compound. Fine dust drifts slowly through the warm work light. Slow, calm, precise, architectural. No people, no hands, no text.
- Estimate: **8.75** (Kling 3.0 pro) / 5 (Kling 4.0)

### C2. Clip 2: KF2 > KF3
- Same model and settings. Start frame KF2, end frame KF3.
- Prompt:
  > Locked-off static camera looking straight up at a ceiling, absolutely no camera movement. The raw taped drywall ceiling is finished and painted smooth plaster-white, crown moulding appears along each tray step, the hidden cove lights fade on with a warm glow, the medallion appears and the chandelier lights softly. Slow, calm, elegant. No people, no hands, no text.
- Estimate: **8.75** / 5
- A bad clip is regenerated on its own, never the pair.

---

## D. Epoxy video

### D1a. Loop keyframe
- Nano Banana 2.1, 16:9, 2K, 2 candidates
- Prompt:
  > Top-down macro photograph of freshly poured metallic epoxy resin, the glossy liquid surface filling the entire frame edge to edge, camera pointing straight down. Slow liquid marbling of ink black, deep charcoal and liquid silver, with soft metallic cells, lacing and fine shimmer; a single thin vein of deep crimson red winding through one third of the frame. Mirror-like wet gloss, soft studio highlights, extreme detail. No horizon, no objects, no people, no text, no letters, no logos, no watermark.
- Estimate: 2 x 2 = **4**

### D1b. Seamless loop, 10 s
- Kling (winning model), 16:9, 10 s, silent. **The D1a frame is both the start and the end frame**, which forces the loop to close.
- Prompt:
  > Locked-off top-down camera, absolutely no camera movement. A thin glossy stream of liquid silver epoxy pours into the centre; the metallic swirls slowly bloom, fold and drift outward in slow motion, then gently settle back into the pattern they started with, so the last frame matches the first. Glossy, liquid, calm, hypnotic. No people, no hands, no text.
- If the seam still shows: a 0.5 s tail-to-head crossfade in ffmpeg (free).
- Estimate: **17.5** (Kling 3.0 pro) / 10 (Kling 4.0)

### D2. Optional "Look down." tilt (your call)
Without D2, a blueprint garage floor plan draws itself instead (free, already planned).
- D2a start still, Nano Banana 2.1, 16:9, 2K, 2 candidates:
  > Architectural interior photograph looking straight up at a finished coffered ceiling in a bright, empty, high-end finished lower level: deep square coffers with crisp plaster-white moulding, smooth matte finish, soft daylight from unseen windows, warm whites and deep shadows. Camera pointing straight up, centred, symmetrical. Photoreal. No people, no furniture, no text, no letters, no logos, no watermark.
- D2b end still, reference edit of D2a, 2 candidates:
  > Using the reference image's room, materials and light, show the same bright, empty room with the camera now pointing straight down at the floor: a seamless high-gloss metallic epoxy floor in ink black, charcoal and liquid silver marbling with one thin deep crimson vein, mirror reflections of the white coffered ceiling and windows in the gloss, plaster-white walls just visible at the frame edges. Photoreal. No people, no furniture, no text, no letters, no logos, no watermark.
- D2c video, Kling, 16:9, 10 s, silent, start D2a, end D2b:
  > One slow, smooth, continuous camera tilt downward: starting looking straight up at the white coffered ceiling, tilting down past the plaster-white walls of the bright, empty room, ending looking straight down at the glossy metallic epoxy floor. Steady tripod head, no shake, no cuts, no zoom. No people, no text.
- Estimate: 4 + 4 + 17.5 = **25.5** (or 18 with Kling 4.0)

---

## E. Textures and swatches (square, made tileable)

All: Nano Banana 2.1, 1:1, 2K, 2 candidates each. Made tileable locally (half-offset + feathered blend); Nano Banana inpaint on the seam cross only if the blend shows. Verified as a 3x3 tile before export to `/public/textures/`.

| ID | Use | Prompt | Est |
|---|---|---|---|
| E1 | Solid finish tab, epoxy service swatch | Flat orthographic top-down texture of a seamless solid-colour epoxy floor coating with a satin finish: uniform medium warm grey, very subtle micro-texture and a gentle satin sheen, evenly lit, no seams, no joints, no objects, no window reflections, edge to edge. Seamless tileable texture. No text, no logos. | 4 |
| E2 | Flake tab (chips also drive the scatter animation) | Flat orthographic top-down texture of a decorative flake epoxy floor: a dense, random broadcast of small irregular vinyl chips in charcoal black, mid grey and white over a grey base, clear satin topcoat, evenly lit, edge to edge. Seamless tileable texture. No text, no logos. | 4 |
| E3 | Metallic tab, shader colour reference, OG image | Flat orthographic top-down texture of a metallic marbled epoxy floor: ink black and liquid silver marbling with soft metallic cells and fine shimmer, high gloss but evenly lit with no hot spots, edge to edge. Seamless tileable texture. No text, no logos. | 4 |
| E4 | Light section background | Flat orthographic texture of a smooth, hand-troweled plaster wall surface in warm off-white: very subtle trowel marks, faint mineral variation, extremely low contrast, flat even light, edge to edge. Seamless tileable texture. No text, no logos. | 4 |
| E5 (optional) | "Textured Finishes" service thumb (there's no real knock-down photo) | Flat orthographic texture of a knock-down drywall ceiling finish: flattened islands of joint compound over a smooth surface, painted matte plaster-white, soft raking light from one side revealing the relief, edge to edge. Seamless tileable texture. No text. | 4 |

---

## F. OG image (code, 0 credits)
Composed in code from KF3 + E3 + the HTML/SVG wordmark, rendered by Playwright to `public/og-image.png` at 1200x630. Built in Phase 5.

---

## Budget

| Line | Credits |
|---|---|
| A. 34 photo upscales | 68 |
| B. KF3 drafts (6) + KF3 4K upscale (2) + KF2 (4) + KF1 (4) | 16 |
| C. Model A/B (10) + Clip 1 (8.75) + Clip 2 (8.75) | 27.5 |
| D1. Loop keyframe (4) + 10 s loop (17.5) | 21.5 |
| E. E1-E4 | 16 |
| **Core subtotal** | **149** |
| D2. "Look down." tilt (optional) | 25.5 |
| E5. Knock-down swatch (optional) | 4 |
| Retry buffer (about one hero clip + one loop + 10 stills) | 46 |
| **Recommended total (core + D2 + E5 + buffer)** | **~225 (19% of 1,210)** |
| Native 9:16 portrait set instead of rotation (only if you pick it) | +29.5 |
| **Worst case, everything** | **~255 (21% of 1,210)** |

If Kling 4.0 wins the A/B, subtract about 22.5. Unused buffer is simply not spent.

**Approval needed:** reply with "approved", plus yes/no on **D2** (+25.5) and **E5** (+4).

---

## Processing spec (after generation, all local)

- Join Clip 1 + Clip 2 with ffmpeg at 1920x1080 (micro-crossfade at the KF2 join only if it pops).
- Desktop: ~240 WebP frames (10 s at 24 fps) at 1920 px in `/public/frames/desktop/`, quality tuned to stay **under ~15 MB**. Light plaster footage compresses worse than dark footage, so quality 60-70 or 1600 px width are the fallbacks.
- Mobile: the same frames rotated 90 degrees (or the native 9:16 clips), 720 px wide, in `/public/frames/mobile/`.
- `poster-start.jpg` (frame 1), `poster-end.jpg` (KF3, the reduced-motion state), `hero-scrub.mp4` (every frame a keyframe, fallback only).
- `public/frames/manifest.json`: counts, sizes and filename pattern; the engine reads it.
- D1/D2: H.264 MP4 (`-movflags +faststart`, no audio) + WebM (VP9), plus a JPG poster each, in `/public/video/`.

---

## Generation log

Every job is logged here: model, prompt ID (section above), settings, job ID, credits, verdict, output file. Raw files go to `/assets/raw/` (gitignored, re-downloadable by job ID).

| Date | Asset | Model / tool | Settings | Job / media ID | Credits | Verdict | Output |
|---|---|---|---|---|---|---|---|
| 2026-10-23 | `01.jpg` import (for the upscale quote only) | `media_import_url` | public URL | media `274607b4-92e6-44d8-a9e6-0b42acdec01e` | 0 | n/a | none |

### Upscale review log
| File | Verdict (upscale / crop) | Note |
|---|---|---|
| (filled in during 0.2) | | |
