# Design: Architectural Editorial

A high-end architecture monograph meets a blueprint. Calm, confident, crafted.
Story: "Look up. Look down." The page moves like a camera tilting down through a room:
ceiling (ink hero) > walls (plaster sections) > floor (the darkest, glossiest epoxy section) > close (ink).

## Tokens (src/app/globals.css)
- Plaster `#F4F1EC` (+ `#EBE6DE`, `#E0D9CF`), Ink `#141414` (+ `#1B1A19`, epoxy `#0C0C0C`), Ashton Red `#C8102E` (only accent), blueprint line `rgba(20,20,20,.18)`.
- Text muted on plaster `rgba(20,20,20,.66)` (5.3:1); muted on ink `rgba(244,241,236,.68)`.
- Radius 0 everywhere. The one exception: the round truck "site seal" (Ashton's own circle crop).
- Plaster texture (E4) behind light sections; one fixed grain layer; faint 48 px blueprint grid on select sections.

## Type
- Display: Instrument Serif 400 (+ italic for emphasis inside the same family), clamp up to ~10rem, tight tracking.
- UI/body: Inter Tight. Labels: JetBrains Mono uppercase 11 px, tracking .12em, written as drawing annotations (`SHEET A-3 / TRAY CEILINGS / 1:24`).
- Mono annotations live on drawings, prints and HUDs, not as an eyebrow above every heading.

## Components
- `FramedPrint`: matted print, warm grade, film grain, tinted shadow; real photos are never full-bleed.
- `Confirm`: visible dashed `{{CONFIRM}}` tag next to any unconfirmed fact.
- `RenderLabel` / `ProjectCaption`: "Illustrative render" vs "Ashton project / caption".
- `CtaButton`: the only CTA ("Request a Design Consultation"), red, sharp, arrow nudges on hover.
- Line drawings: `.ink-lines` + `.draw` paths with `pathLength=1`, drawn on enter (`useDrawOnView`) or scrubbed by GSAP.

## Motion grammar
- Slow architectural easing (`cubic-bezier(.22,1,.36,1)`, `cubic-bezier(.65,0,.35,1)`), never bouncy.
- GSAP + ScrollTrigger for scroll-linked and pinned scenes (hero sequence, collection pan, process build, epoxy pour); Lenis on the GSAP ticker; Motion for UI (modal, menu, toggles, tabs). Transform/opacity only (plus SVG stroke drawing and shader uniforms).
- Reduced motion: no scrubbing, no smooth scroll, final states shown.

## Signature moments
1. Ceiling hero: reflected ceiling plan draws itself, then hands off to a 241-frame canvas sequence (framing > drywall > finished tray), then the render shrinks into a print and crossfades to the real Ashton tray ceiling.
2. Epoxy: "Look down." tilt video, WebGL metallic pour that settles to a mirror, finish tabs Solid / Flake / Metallic.
