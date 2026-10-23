# Ashton Innovations: Implementation Kickstart

Concept demo site for **Ashton Innovations Drywall & Painting Inc.** (Fredericksburg, VA).
Front-end only: no backend, no database, the form sends nothing.

**How this file works**
- One phase at a time. After each phase: tick the boxes, commit, push, and STOP for preview.
- Boxes get ticked, never deleted. Anything dropped is struck through with a reason.
- Gates marked **GATE** need your OK before I continue.
- Companion file: [`assets_plan.md`](assets_plan.md) (every generated asset, prompt, credit estimate and job log).

---

## Design read (from the design-taste-frontend skill)

> Reading this as: a **persuasive landing page for custom homebuilders and higher-end homeowners**, in an **architectural-editorial / blueprint** language, leaning toward **Next.js + Tailwind v4 tokens + GSAP scroll choreography + a canvas frame-sequence hero and one WebGL moment**.

Dials: `DESIGN_VARIANCE 7` / `MOTION_INTENSITY 8` / `VISUAL_DENSITY 3` (gallery-airy, cinematic but slow and calm).

### Where the brief overrides the design skills (the brief wins)
| Skill default | Brief | Resolution |
|---|---|---|
| Taste skill flags Instrument Serif / Fraunces as overused AI defaults | Brief names them | Use **Instrument Serif** (high-contrast, condensed, reads like a monograph title). Fraunces is softer and less architectural. |
| Taste skill flags cream backgrounds | Brief pins Plaster `#F4F1EC` | Keep it. Plaster is literally the material Ashton works in. |
| "One theme per page" | Light plaster sections + ink sections, epoxy darkest | Intentional colour-block story (ceiling > walls > floor). No dark-mode toggle: the palette is art-directed. |
| Eyebrow limit (1 per 3 sections) | Mono blueprint annotations | Mono labels live **on drawings, prints and the hero HUD** as annotations, not as an eyebrow above every headline. |
| Impeccable "direction roll" for new visual worlds | Brief pins the world | Brief-pinned direction wins. ~~Run the roll once in Phase 1 for raises.~~ Skipped: you chose code-first and a straight-through build, and the brief already fixes the world. |

### House rules for every phase
- Zero em dashes in visible copy. Plain, specific sentences. No "elevate / seamless / unleash".
- One CTA label everywhere: **Request a Design Consultation**, one shared modal.
- Ashton Red `#C8102E` is the only accent. Contrast math: red on plaster = **5.2:1** (passes AA); red on ink = **3.1:1** (passes for large text and UI only). So: no small red text on ink sections; red is used there for lines, fills and the button background (plaster text on red = 5.2:1).
- Animate transform/opacity only. Everything honours `prefers-reduced-motion`.
- No `window.addEventListener('scroll')`: ScrollTrigger + Lenis on one shared ticker.
- Motion (Framer Motion, now imported from `motion/react`) for UI only; GSAP and three.js live in separate components and never share a tree with Motion.
- Honesty: AI renders carry `ILLUSTRATIVE RENDER`; real photos carry `ASHTON PROJECT / ...`; the two never share a gallery. Unknowns render as a visible `{{CONFIRM}}` token.

---

## Discovery findings (done this session, 0 credits spent)

- **Higgsfield MCP: connected.** Balance **1,210 credits**, Plus plan.
- **Current model names** (from `models_explore`, not memory):
  - Stills: **Nano Banana 2.1** (Google; reference editing, seed, up to 4K). "Nano Banana Pro" is not listed; 2.1 is the current Google model. Fallback: GPT Image 2.5.
  - Video with first + last frame: **Kling 3.0** (named in the brief) and **Kling 4.0** (newer, cheaper at 1080p). Plan: a cheap A/B on Clip 1, then pick.
  - Upscaler: `upscale_image` (ByteDance backend, 2K or 4K target, **no creative/faithful switch**, 2 credits per photo).
- **All 35 photo URLs return 200.** Each is 430x482.
- **The photos are not clean photos.** Each ceiling, drywall and paint image is a scanned-look Polaroid: white border, drop shadow, and a **handwritten caption baked into the pixels** (e.g. "Tray Ceiling with Light Medalion"). The usable photo inside is only about **350x350 px**. The truck is a circle crop on white.
  - Plan: auto-crop the inner photo **before** upscaling (otherwise the upscaler mangles the handwriting), then present them in our own framed-print component with HTML captions.
  - Bonus: the baked captions are Ashton's own names for each project. I transcribed all of them (see `assets_plan.md` section A) and will use them for captions instead of inventing descriptions.
- **The drywall and paint photos show Ashton's real crew** in hard hats and Ashton-branded shirts, covering fireplaces, tubs and windows in plastic before work. That is real proof for "every crew member wears a hard hat" and "clean jobsites". The "no people" rule applies only to generated assets; these real photos stay. (Faces need extra care in the upscale review.)
- **paint3 and paint4 are exterior painting** ("Painting exterior trim and columns"), but the service list only says interior painting. See question 4.
- The old splash page already used **blueprint drawings as its background**, and the logo is heavy black italic type with a red swoosh ending in a putty knife. So the blueprint direction is an evolution of their own brand, not a costume.

---

## Clarifying questions

Asked through the question tool. **Answers (2026-10-23):**
- Preview: **"Blast through the phases and build the whole site in one go."** No stop between phases; one Vercel preview link at the end.
- Mobile hero: **rotate the desktop clips 90 degrees** (0 credits).
- Mockups: **no, build in code** (code-first, recorded in `.impeccable/config.json`).
- Exterior painting: **keep the photos, no exterior claim.**
- Budget: **approved, full plan** (including optional D2 and E5). I pick keyframe drafts myself.

1. **How do you want to preview each phase?** My recommendation: a private Vercel preview link per phase plus screenshots in chat. Alternatives: screenshots only, or pull the branch and run it yourself.
2. **Mobile hero frames: rotate or generate?** Looking straight up at a ceiling there is no "up", so the 16:9 clip rotated 90 degrees *is* a true portrait view with identical geometry, for 0 extra credits. Generating native 9:16 versions (as the brief says) costs about 30 more credits and risks desktop and mobile not matching. I recommend rotate.
3. **Design mockup before code?** The impeccable skill asks once whether to approve an image mockup of each section before coding it ("comp-first"), or build straight in code and review the real thing ("code-first"). I recommend code-first, since you preview every phase anyway.
4. **Exterior painting.** Two real painting photos are exterior work. Default: keep them in the gallery with their original captions, keep "Interior Painting" as the only painting service, and add no exterior claim.

Facts I will **not** invent (shown as absent, or as `{{CONFIRM}}`):
- Years in business: `{{CONFIRM}}` (2006-era copy says 20+ drywall / 15 decorative).
- Epoxy finishes and spaces: `{{CONFIRM}}` tokens per the brief.
- Success-state promise "We'll call you within one business day": wrapped in `{{CONFIRM}}`.
- Email address, business hours, licence number, warranties, prices, cure times: **not shown at all** (none were provided).
- Testimonials: two muted cards labelled "Sample: replace with a real client review".

---

## Phase map (brief sections > phases)

The brief's phase list doesn't name sections 3, 11 and 12, so I placed them where they sit on the page:
- Statement strip (3) goes in Phase 2, right after the hero.
- Service area map (11) and the final CTA (12) go in Phase 4.
- The consultation modal goes in **Phase 1**, so the hero CTA works from the first preview. The `/contact` page reuses it in Phase 4.

---

## Phase 0: Higgsfield asset plan + generation

### 0.1 Discover and plan (no spend)
- [x] Confirm Higgsfield MCP is connected
- [x] `balance`: 1,210 credits (Plus)
- [x] `models_explore`: pick stills / video / upscaler by capability (see findings)
- [x] Free `get_cost` quotes for every model and setting in the plan
- [x] Check all 35 photo URLs; contact-sheet review; transcribe baked captions
- [x] Write `assets_plan.md`: every asset, purpose, model, settings, exact prompt, estimate, total vs balance
- [x] **GATE: you approve `assets_plan.md` and its credit budget** (approved: full plan with D2 and E5)

### 0.2 Real photos (A)
- [x] Download all 35 originals into `/public/work/originals/` (committed, untouched)
- [x] Script: auto-detect and crop the inner photo of each Polaroid (drop border + handwriting) into `/assets/crops/`; truck cropped to its circle's square
- [x] Store transcribed captions in `src/data/photos.ts` (source of truth for every real-photo caption)
- [x] Changed approach: upscale the full original print, then crop the photo out (same box), which keeps the result near 4x; photo `24` rejected and kept from the original crop
- [x] Upload crops to Higgsfield; run `upscale_image` (2K target) on the 34 work photos (splash is brand reference only, not upscaled)
- [x] Build side-by-side compare sheets (crop vs upscale) in `/assets/compare/` and review **every** pair: mouldings, trim, chandeliers, shirt logos, crew faces
- [x] Accepted: resample to ~1400 px (about 4x) and save to `/public/work/<same filename>`. Rejected: use the crop with a gentle local Lanczos resize instead. Log each verdict in `assets_plan.md`
- [x] Apply the unified print grade later in CSS/next/image, not baked in, so it can be tuned

### 0.3 Ceiling hero keyframes (B)
- [x] `get_preferences` (Higgsfield project/folder handling) before the first generation
- [x] KF3 drafts at 1K: 4 variants (2 square-corner trays, 2 clipped-corner trays that rhyme with the real `01.jpg`)
- [x] **GATE: KF3 draft picked** (by me, per your "one go" instruction: clipped-corner seed 201)
- [x] KF3 final: faithful 4K upscale of the chosen draft (no drift from what you approved)
- [x] KF2 (mid-construction) and KF1 (framing): 2 candidates each, 2K, as reference edits of KF3 final
- [x] Geometry check: overlay KF1/KF2/KF3 at 50% to confirm the tray edges line up
- [x] **GATE: KF1 / KF2 / KF3 approved** (by me; overlay check showed the tray edges line up in all three)
- [x] Portrait set per question 2 (rotate, or native 9:16 edits)

### 0.4 Ceiling hero video (C)
- [x] Model A/B: Clip 1 on Kling 4.0 (720p) and Kling 3.0 (std); compare locked camera, geometry hold, artefacts
- [x] Clip 1 (KF1 > KF2) and Clip 2 (KF2 > KF3) at final quality, 5 s, silent, chosen model
- [x] Review each clip frame by frame; regenerate only a failing clip
- [x] ~~Portrait clips per question 2~~ Not needed: the 16:9 clips are rotated 90 degrees for portrait frames

### 0.5 Epoxy video (D)
- [x] D1 keyframe (top-down metallic pour, one thin red vein): 2 candidates; pick
- [x] D1 clip: 10 s, D1 keyframe as **both** first and last frame so it loops; verify the loop seam; fall back to an ffmpeg tail crossfade if needed
- [x] D2 (only if approved): start still (coffered ceiling), end still (same room, epoxy floor), 10 s tilt between them

### 0.6 Textures (E)
- [x] E1 solid satin gray, E2 flake/chip, E3 metallic marble, E4 plaster: 2 candidates each at 2K
- [x] Make each tileable (local half-offset + feathered blend; Nano Banana inpaint on the seam cross only if needed)
- [x] Verify with a 3x3 tiled preview; export to `/public/textures/`
- [x] E5 knock-down texture swatch (optional, for "Textured Finishes")

### 0.7 Processing
- [x] Download every output to `/assets/raw/` (gitignored); log model, prompt, settings, job ID, credits in `assets_plan.md`
- [x] ffmpeg: join Clip 1 + Clip 2 (micro-crossfade at the KF2 join only if it pops)
- [x] Desktop frames: ~240 WebP at 1920 px in `/public/frames/desktop/`, total **under ~15 MB** (lower quality, width or count if needed)
- [x] Mobile frames: ~240 portrait WebP at 720 px in `/public/frames/mobile/`
- [x] `poster-start.jpg` (first frame), `poster-end.jpg` (KF3, used for reduced motion), all-keyframe `hero-scrub.mp4` fallback
- [x] `public/frames/manifest.json` with real counts and sizes; the engine reads it, so config can never drift from disk
- [x] D1/D2 to web MP4 (H.264, faststart, no audio) + WebM, with poster frames, into `/public/video/`
- [x] Commit (excluding `/assets/raw`) and push. ~~STOP~~ No stop, per your instruction

---

## Phase 1: Foundation + Ceiling Hero

### 1.1 Context and scaffold
- [x] Write `PRODUCT.md` (impeccable product record: users, purpose, positioning, evidence on hand, what must never be invented)
- [x] Write `DESIGN.md` (the pinned visual world: tokens, type scale, motion grammar, annotation system, honesty labels)
- [x] Scaffold Next.js (App Router, TypeScript, Tailwind v4, ESLint) in the repo root
- [x] `.gitignore`: `node_modules`, `.next`, `.env*`, `/assets/raw`
- [x] `vercel.json`: `Cache-Control: public, max-age=31536000, immutable` for `/frames/*` and `/video/*`
- [x] Install (versions checked): `gsap` 3.15, `lenis` 1.3, `motion` 14.6, `three` 0.186 (loaded only by the epoxy shader, dynamically)
- [x] `src/data/business.ts`: every real fact from the brief in one file, with `{{CONFIRM}}` fields typed as such

### 1.2 Design system
- [x] CSS variables: `--plaster #F4F1EC`, `--ink #141414`, `--red #C8102E`, `--line rgba(20,20,20,.18)` plus plaster-on-ink line tint
- [x] `next/font`: Instrument Serif (display, clamp up to ~9rem, tight tracking), Inter Tight (UI/body), JetBrains Mono (annotations)
- [x] One radius system (sharp, 0 px) for prints, buttons and inputs
- [x] Texture layers: E4 plaster on light sections; one fixed, pointer-events-none grain overlay; faint blueprint-grid utility
- [x] `<Confirm>` token component (visible, dashed outline, mono) and `<RenderLabel>` / `<ProjectCaption>` components
- [x] `<FramedPrint>` component: matte border, consistent tinted shadow, subtle warm grade and film grain, never full-bleed

### 1.3 Shell
- [x] Smooth-scroll provider: Lenis driven by `gsap.ticker`, ScrollTrigger synced, disabled under reduced motion
- [x] Nav: typeset "ASHTON INNOVATIONS" + small red brush-stroke/putty-knife mark; anchors (Ceilings, Process, Epoxy Floors, Services, Contact); phone; red CTA; transparent over hero, plaster + blur after; burger menu on mobile; single line at desktop, under 80 px tall
- [x] Consultation modal (shared by every CTA through context, with optional preselect): I'm a (Homeowner/Builder/Business), Name, Phone, Email, Town, Project type multi-select (6 ceilings + Drywall + Painting + Epoxy Floor + Not sure), Timeline, Message; labels above inputs, inline errors, client validation, focus trap, Esc to close, polished success state with `{{CONFIRM}}`; sends nothing

### 1.4 Ceiling hero, "Look up."
- [x] Ink background + faint blueprint grid
- [x] Reflected ceiling plan SVG that draws itself (~2.5 s): offset tray rectangles matching KF3's geometry, medallion circle, dimension lines, annotations (e.g. `SHEET A-1 / REFLECTED CEILING PLAN / 1:48`)
- [x] "Look up." fades in; subhead (verbatim from the brief); CTA
- [x] `src/components/engine/ScrollSequence.tsx`: canvas + preloaded `Image` objects; progressive load (every 16th frame first, then fill in); eased scrub; DPR capped at 2; cover fit; portrait set below 768 px; poster until first frames land; frame counts from `manifest.json`; never scrubs a `<video>` by `currentTime`
- [x] Blueprint lines fade out as the framing fades in ("the drawing becomes the structure")
- [x] HUD: `01 FRAME / 02 HANG & FINISH / 03 REVEAL`, thin red progress line, `ILLUSTRATIVE RENDER` caption; canvas has an `aria-label`
- [x] End beat: render shrinks into a framed print and crossfades to the real `01.jpg` captioned `ASHTON PROJECT / TRAY CEILING`, line "Now picture yours."
- [x] Reduced motion: drawn blueprint + `poster-end.jpg` + real photo, no scrub, no smooth scroll
- [x] Early metadata: title, `noindex`

### 1.5 QA gate (see "QA gate" below) > tick > commit > push. No per-phase stop (your instruction); one preview at the end.

---

## Phase 2: Statement strip, Ceiling Collection, Process

### 2.1 Statement strip
- [x] Serif line: "Most homes ignore the fifth wall. Yours won't."
- [x] Three quiet facts: years in drywall `{{CONFIRM}}`, 6 signature ceiling designs, ceilings to floors

### 2.2 The Ceiling Collection
- [x] Data for the 6 designs (Sculptured Ceilings, Tray Ceilings, Raised Panels, Track Ceilings, Light Medallions, Arches): name, one-line description, `SHEET` label, real photos mapped from the brief's lists
- [x] Six blueprint SECTION/PROFILE SVGs (one per design), line-drawn on enter
- [x] Desktop: pinned horizontal scroll (`start: "top top"`, pin, scrub). Mobile: swipe carousel with scroll-snap
- [x] Full-screen gallery modal: arrow keys, Esc, focus trap, swipe on touch, `ASHTON PROJECT / <their caption>` captions
- [x] Real photos only in this section

### 2.3 From Blueprint to Finish
- [x] Pinned SVG wall cross-section building layer by layer: Framing > Board hung > Tape & mud > Texture/Sand > Prime > Paint (red on the final coat)
- [x] Hard hats + OSHA as craft discipline, backed by a real crew photo in a framed print
- [x] Last frame pans down to the floor line and hands off to the epoxy section

### 2.4 QA gate > tick > commit > push (no stop)

---

## Phase 3: Epoxy Floors

- [x] "Look down." transition in giant serif, background stays ink: D2 plays on scroll if it exists, otherwise a garage floor plan draws itself
- [x] `src/components/epoxy/EpoxyShader.tsx` (three.js, dynamically imported, own file): liquid metallic surface coloured from E3; flow follows scroll and settles into a mirror finish; cursor ripple + moving specular highlight; paused when off-screen or tab hidden
- [x] Capability gate: mobile, low-power (`hardwareConcurrency`, `deviceMemory`, Save-Data) or reduced motion > D1 loop video instead (with `aria-label`)
- [x] Finish selector tabs Solid / Flake / Metallic (`{{CONFIRM}}`): swap E1/E2/E3 via uniforms or crossfade; Flake "broadcasts" chips in a scatter animation
- [x] Where-it-goes chips: Garages, Basements, Workshops, Commercial (`{{CONFIRM}}`)
- [x] Copy: the craft that goes into a sculptured ceiling now goes into the floor; one crew for the whole room
- [x] Three framed slots: "Your epoxy project photo here"
- [x] CTA opens the modal with "Epoxy Floor" preselected
- [x] `ILLUSTRATIVE RENDER` on the shader, D1, D2 and swatches
- [x] Section is the darkest, glossiest part of the page
- [x] QA gate (plus a screenshot of each finish tab) > tick > commit > push (no stop)

---

## Phase 4: Services, Builders/Homeowners, Gallery, Proof, Service area, Final CTA, Footer, /contact

- [x] Services: editorial two-column list (not icon cards); hover/tap expands a real photo thumb (E1-E3 swatch for epoxy); six items, Epoxy Floor Coatings tagged "New"
- [x] For Builders / For Homeowners: accessible toggle swapping the copy from the brief
- [x] Selected Rooms: masonry gallery of real drywall + painting photos as framed prints, hover lift + caption, no AI images
- [x] Proof: two muted cards labelled "Sample: replace with a real client review"; no fabricated reviews, awards, licences, warranties or counts
- [x] Service area: minimal ink-line SVG map (Fredericksburg, Stafford, Spotsylvania, with Hartwood) with red dots and labels; schematic, no map API
- [x] Final CTA (ink): "From the ceiling to the floor.", the CTA, and the phone as a large tap-to-call link
- [x] Footer: wordmark, full legal name, tagline, nav, service area, phone, PO Box 133, Hartwood, VA 22471, ©, and "Concept preview by Lee Enterprises Unlimited. Illustrative renders are AI-generated."
- [x] `/contact`: the same form inline, phone, service area, footer; the footer "Contact" link lands at the **top** of `/contact` (Lenis and scroll reset on route change)
- [x] QA gate > tick > commit > push (no stop)

---

## Phase 5: Polish, QA, Metadata

- [x] OG image composed in code from KF3 + E3 + the HTML/SVG wordmark, rendered by Playwright to `public/og-image.png` (1200x630)
- [x] Metadata: exact title; description; Open Graph + Twitter `summary_large_image`; favicon + apple-touch-icon; `<meta name="robots" content="noindex">`; `metadataBase`
- [x] Responsive pass at 375 / 768 / 1280 / 1920: no horizontal scroll, tap targets at least 44 px
- [x] Accessibility: landmarks, descriptive alt text, visible focus, modal trap + Esc, AA contrast audit (red on plaster and on ink), aria-labels on canvas and videos
- [x] Performance: Lighthouse mobile at least 90 on a production build; everything below the hero lazy-loaded; only transform/opacity animated
- [x] Impeccable `detect` run + taste-skill pre-flight checklist (em dashes, eyebrow count, CTA wrap, duplicate CTAs, etc.)
- [x] Copy audit: every real fact matches the brief word for word; every unknown is a visible `{{CONFIRM}}`; every AI visual is labelled
- [x] Hand-off notes: list of every `{{CONFIRM}}`, every photo slot, and what to swap for production
- [x] Final QA gate > tick > commit > push > Vercel preview

---

## Results (2026-10-23)

- **Lighthouse (mobile, production build):** Performance 92, Accessibility 100, Best Practices 100, SEO 63. SEO is marked down only for `noindex`, which the brief requires.
- **Playwright** at 1440x900 and 390x844: hero at 0 / 12 / 40 / 70 / 90 / 99 %, every section, pinned sections at start/middle/end, epoxy with each finish tab, reduced motion, and `/contact`. Zero console errors on `/` (only headless software-WebGL notices). `/contact` logs one harmless Next.js CSS-preload notice.
- No horizontal scroll at 375 / 768 / 1280 / 1920. All visible tap targets are 44 px or more.
- Frame manifest: 241 desktop + 241 portrait frames, matching the files on disk.
- Impeccable detector: one advisory (blueprint grid background), kept on purpose because the brief asks for it.
- Credits: this build spent about 165.5. About 223 more were spent on the same Higgsfield account by something else during the session (see `assets_plan.md`).

## Hand-off: what the owner should confirm or replace

1. Every `{{CONFIRM}}` token (registry below): years in drywall and decorative work, epoxy finishes and spaces, the "call within one business day" promise.
2. Three "Your epoxy project photo here" slots in the epoxy section.
3. Two "Sample: replace with a real client review" cards.
4. The form sends nothing yet: connect it to email/CRM before launch.
5. Remove `noindex` (in `src/app/layout.tsx` metadata) when the site goes live, and set `NEXT_PUBLIC_SITE_URL` to the real domain.
6. Optional: a vector of the original logo, if the owner wants it instead of the typeset wordmark.

## QA gate (run before calling any phase done)

- [x] Playwright at **1440x900** and **390x844**
- [x] Hero screenshots at 0 / 40 / 90 % scroll (from Phase 1 on); epoxy screenshot per finish tab (from Phase 3 on); I look at every screenshot myself
- [x] Zero console errors and warnings worth fixing
- [x] Frame count in `manifest.json` matches the files on disk
- [x] Reduced-motion run: page is complete and static
- [x] No horizontal scroll at 375 / 768 / 1280 / 1920
- [x] Honesty check: real facts verbatim, `{{CONFIRM}}` visible, render labels present, no AI image in a real-photo gallery
- [x] "Would this place on Awwwards?" If a section reads like a template, redesign it before stopping

---

## Planned file layout

```
implementation_kickstart.md   assets_plan.md   PRODUCT.md   DESIGN.md
scripts/            crop-photos, make-frames.sh, make-tileable, og-image
assets/raw/         Higgsfield downloads (gitignored)
assets/crops/       inner photos cut from the Polaroids
assets/compare/     crop vs upscale review sheets
public/work/originals/   35 untouched originals
public/work/        upscaled/accepted photos (same filenames)
public/frames/      desktop/, mobile/, manifest.json
public/video/       poster-start.jpg, poster-end.jpg, hero-scrub.mp4, epoxy-loop.*, look-down.*
public/textures/    e1-solid, e2-flake, e3-metallic, e4-plaster (+ e5-knockdown)
src/app/            layout.tsx, page.tsx, contact/page.tsx, globals.css
src/components/sections/   Nav, CeilingHero, StatementStrip, CeilingCollection, Process,
                           EpoxyFloors, Services, Audience, SelectedRooms, Proof,
                           ServiceArea, FinalCta, Footer (one file each, under ~500 lines)
src/components/engine/ScrollSequence.tsx
src/components/epoxy/EpoxyShader.tsx (+ GLSL)
src/components/consult/    ConsultProvider, ConsultModal, ConsultForm
src/components/ui/         FramedPrint, GalleryModal, Confirm, RenderLabel, BlueprintDraw
src/data/                  business.ts, ceilings.ts, photos.ts, services.ts
```

## `{{CONFIRM}}` registry (kept current every phase)

| Where | Token | Default shown |
|---|---|---|
| Statement strip (fact + About paragraph) | Years in drywall installation | `{{CONFIRM}}` 20+ |
| Statement strip (About paragraph) | Years in decorative drywall design | `{{CONFIRM}}` 15+ |
| Epoxy finish tabs | Solid / Flake / Metallic | each tab label tokenised |
| Epoxy spaces | Garages, Basements, Workshops, Commercial | one token on the set |
| Form success state | "We'll call you within one business day" | wrapped |
