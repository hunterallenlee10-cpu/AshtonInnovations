"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ceilingDesigns, type CeilingDesign } from "@/data/ceilings";
import { photoById, photosByGroup, type Photo } from "@/data/photos";
import { business } from "@/data/business";
import { profileFor } from "@/components/collection/Profiles";
import { GalleryModal } from "@/components/collection/GalleryModal";
import { ProjectCaption } from "@/components/ui/Labels";
import { CtaButton } from "@/components/consult/CtaButton";
import { useDrawOnView } from "@/lib/useDrawOnView";

gsap.registerPlugin(ScrollTrigger);

const orderedPhotos = (d: CeilingDesign): Photo[] => {
  const lead = photoById(d.lead);
  return [lead, ...photosByGroup(d.group).filter((p) => p.id !== lead.id)];
};

function Sheet({ design, onOpen }: { design: CeilingDesign; onOpen: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  useDrawOnView(ref, { threshold: 0.3 });
  const photos = orderedPhotos(design);
  const [lead, ...rest] = photos;
  const Profile = profileFor[design.slug as keyof typeof profileFor];

  return (
    <article
      ref={ref}
      aria-labelledby={`sheet-${design.slug}`}
      className="relative flex w-[88vw] shrink-0 snap-center flex-col border border-line-strong bg-[#f8f6f1]/85 sm:w-[78vw] lg:h-full lg:w-[min(1180px,76vw)]"
    >
      <div className="grid flex-1 gap-8 p-5 sm:p-8 lg:min-h-0 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:p-10">
        <div className="flex min-h-0 flex-col">
          <p className="annot text-muted">
            Sheet {design.sheet} <span aria-hidden="true">/</span> {design.name}{" "}
            <span aria-hidden="true">/</span> {design.scale}
          </p>
          <div className="mt-6 flex min-h-0 flex-1 items-center lg:max-h-[38vh]">
            <Profile />
          </div>
          <p className="annot mt-3 text-muted">{design.view}</p>
          <h3 id={`sheet-${design.slug}`} className="display mt-6 text-[clamp(2.5rem,4vw,4.2rem)]">
            {design.name}
          </h3>
          <p className="mt-3 max-w-[38ch] text-[17px] leading-relaxed text-muted">{design.line}</p>
        </div>

        <div className="flex min-h-0 flex-col justify-center lg:items-end">
          <figure className="w-full lg:w-[min(100%,46vh)]">
            <button
              type="button"
              onClick={() => onOpen(0)}
              className="group block w-full text-left"
              aria-label={`Open ${design.name} photos, starting with ${lead.caption}`}
            >
              <div className="print transition-transform duration-700 ease-[var(--ease-arch)] group-hover:-translate-y-1.5">
                <Image
                  src={lead.src}
                  alt={lead.alt}
                  width={lead.width}
                  height={lead.height}
                  sizes="(max-width: 1023px) 80vw, 46vh"
                  className="h-auto w-full"
                />
              </div>
            </button>
            <figcaption className="mt-3">
              <ProjectCaption caption={lead.caption} className="text-muted" />
            </figcaption>
          </figure>
          {rest.length > 0 && (
            <div className="mt-5 flex w-full items-center gap-2 lg:w-[min(100%,46vh)]">
              {rest.slice(0, 3).map((p, k) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onOpen(k + 1)}
                  className="relative size-14 shrink-0 overflow-hidden border border-line transition-transform duration-500 hover:-translate-y-0.5 sm:size-16"
                  aria-label={`Open photo: ${p.caption}`}
                >
                  <Image src={p.src} alt="" width={128} height={128} sizes="64px" className="h-full w-full object-cover" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => onOpen(0)}
                className="annot ml-auto inline-flex min-h-11 items-center gap-1.5 text-ink hover:text-red"
              >
                All {photos.length} rooms <ArrowUpRight size={14} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* drawing-sheet title block */}
      <div className="annot grid grid-cols-2 border-t border-line-strong text-muted sm:grid-cols-4">
        <span className="border-r border-line px-4 py-3 max-sm:hidden">{business.brand}</span>
        <span className="border-r border-line px-4 py-3">{design.view}</span>
        <span className="px-4 py-3 sm:border-r sm:border-line">Sheet {design.sheet}</span>
        <span className="px-4 py-3 max-sm:hidden">Scale {design.scale}</span>
      </div>
    </article>
  );
}

function Intro({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <h2 id="collection-title" className="display text-[clamp(3.2rem,6.4vw,6.6rem)] leading-[0.92]">
        The Ceiling
        <br />
        Collection
      </h2>
      <p className="mt-6 max-w-[34ch] text-[clamp(17px,1.3vw,19px)] leading-relaxed text-muted">
        Six signature designs, each drawn on paper first and then built in drywall. Every photo on
        these sheets is a real Ashton room.
      </p>
    </div>
  );
}

export function CeilingCollection() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [gallery, setGallery] = useState<{ slug: string; index: number } | null>(null);
  const active = gallery ? ceilingDesigns.find((d) => d.slug === gallery.slug) ?? null : null;

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current;
      const s = section.current;
      if (!t || !s) return;
      const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);
      gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: s,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={section}
      id="ceilings"
      data-nav-theme="light"
      aria-labelledby="collection-title"
      className="plaster-surface relative overflow-hidden lg:h-[100dvh]"
    >
      <div className="blueprint-grid blueprint-grid-faint pointer-events-none absolute inset-0" aria-hidden="true" />

      <Intro className="relative px-[var(--gutter)] pb-10 pt-[clamp(96px,14vw,160px)] lg:hidden" />

      <div
        ref={track}
        className="collection-track relative flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-[clamp(72px,10vw,120px)] [scrollbar-width:none] lg:h-full lg:snap-none lg:items-stretch lg:gap-[4vw] lg:overflow-visible lg:pb-14 lg:pt-[calc(var(--nav-h)+32px)]"
      >
        <Intro className="hidden w-[30vw] shrink-0 flex-col justify-end pb-6 lg:flex" />
        {ceilingDesigns.map((d) => (
          <Sheet key={d.slug} design={d} onOpen={(index) => setGallery({ slug: d.slug, index })} />
        ))}
        <div className="flex w-[80vw] shrink-0 snap-center flex-col justify-end pb-6 sm:w-[60vw] lg:w-[34vw]">
          <p className="display text-[clamp(2.8rem,4.6vw,4.8rem)] leading-[0.95]">Seen one you like?</p>
          <p className="mt-5 max-w-[32ch] text-[17px] leading-relaxed text-muted">
            Every design is adapted to the room, the house and the light. It starts with a conversation.
          </p>
          <div className="mt-8">
            <CtaButton />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-7 hidden h-px bg-line lg:block" aria-hidden="true">
        <div ref={bar} className="h-[2px] origin-left scale-x-0 bg-red" />
      </div>

      {active && (
        <GalleryModal
          title={active.name}
          photos={orderedPhotos(active)}
          index={gallery?.index ?? null}
          onIndex={(index) => setGallery((g) => (g ? { ...g, index } : g))}
          onClose={() => setGallery(null)}
        />
      )}
    </section>
  );
}
