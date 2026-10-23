"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { services, type Service } from "@/data/services";
import { photoById } from "@/data/photos";
import { ProjectCaption, RenderLabel } from "@/components/ui/Labels";

/*
  Editorial two-column index. Each row reserves a square "drawing box" on the
  right; hovering (mouse), focusing or tapping a row reveals its thumb inside
  that box. Nothing reflows: only opacity and transform change.
*/

function Thumb({ s, open }: { s: Service; open: boolean }) {
  const v = s.visual;
  return (
    <div className="relative aspect-square w-[clamp(88px,10.5vw,152px)] shrink-0" aria-hidden={!open}>
      {/* empty state: a blueprint crop-mark box */}
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 h-full w-full text-ink/25 transition-opacity duration-500 ${open ? "opacity-0" : "opacity-100"}`}
        aria-hidden="true"
      >
        <path d="M0 14V0h14M86 0h14v14M100 86v14H86M14 100H0V86" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M44 50h12M50 44v12" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div
        className={`absolute inset-0 origin-bottom-right transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.92] opacity-0"
        }`}
      >
        {v.kind === "photo" && (
          <div className="print h-full !p-[5px]">
            <Image
              src={photoById(v.photoId).src}
              alt={photoById(v.photoId).alt}
              width={300}
              height={300}
              sizes="160px"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {v.kind === "swatch" && (
          <div className="print h-full !p-[5px]">
            <Image src={v.src} alt={v.alt} width={300} height={300} sizes="160px" className="h-full w-full object-cover" />
          </div>
        )}
        {v.kind === "swatches" && (
          <div className="relative h-full">
            {v.items.map((it, i) => (
              <div
                key={it.src}
                className="print absolute !p-[4px]"
                style={{
                  width: "64%",
                  height: "64%",
                  left: `${i * 18}%`,
                  top: `${i * 18}%`,
                  zIndex: i,
                }}
              >
                <Image src={it.src} alt={it.alt} width={200} height={200} sizes="100px" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  s,
  open,
  onOpen,
  onToggle,
}: {
  s: Service;
  open: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const v = s.visual;
  const caption =
    v.kind === "photo" ? (
      <ProjectCaption caption={photoById(v.photoId).caption} className="text-muted" />
    ) : (
      <RenderLabel className="text-muted" />
    );

  return (
    <li className="border-t border-line-strong">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        onPointerEnter={(e) => e.pointerType === "mouse" && onOpen()}
        onFocus={onOpen}
        className="group grid w-full grid-cols-[1fr_auto] items-start gap-x-6 py-7 text-left md:gap-x-10 md:py-9"
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="display text-[clamp(1.85rem,3.1vw,2.9rem)] leading-[1.02] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
              {s.name}
            </span>
            {s.isNew && (
              <span className="annot translate-y-[-0.3em] border border-red px-2 py-0.5 text-red">New</span>
            )}
          </span>
          <span className="mt-3 block max-w-[46ch] text-[16px] leading-relaxed text-muted">{s.description}</span>
          <span
            className={`mt-4 block min-h-[1.4em] transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
          >
            {caption}
          </span>
        </span>
        <span className="flex items-start gap-4">
          <Thumb s={s} open={open} />
          <Plus
            size={18}
            weight="light"
            aria-hidden="true"
            className={`mt-1 hidden shrink-0 transition-transform duration-500 sm:block ${open ? "rotate-45" : ""}`}
          />
        </span>
      </button>
    </li>
  );
}

export function Services() {
  const [openId, setOpenId] = useState<string | null>(services[0].id);
  const left = services.slice(0, 3);
  const right = services.slice(3);

  const rows = (list: Service[]) =>
    list.map((s) => (
      <Row
        key={s.id}
        s={s}
        open={openId === s.id}
        onOpen={() => setOpenId(s.id)}
        onToggle={() => setOpenId((cur) => (cur === s.id ? null : s.id))}
      />
    ));

  return (
    <section
      id="services"
      data-nav-theme="light"
      aria-labelledby="services-title"
      className="plaster-surface relative py-[clamp(96px,14vw,200px)] text-ink"
    >
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
        <h2 id="services-title" className="display max-w-[14ch] text-[clamp(3rem,7vw,6.4rem)]">
          Every surface in the room.
        </h2>
        <p className="mt-6 max-w-[48ch] text-[clamp(17px,1.4vw,19px)] leading-relaxed text-muted">
          Six trades under one name, from the ceiling over your head to the floor under your feet.
        </p>

        <div className="mt-[clamp(56px,8vw,112px)] grid gap-x-[clamp(32px,6vw,112px)] lg:grid-cols-2">
          <ul className="border-line-strong lg:border-b">{rows(left)}</ul>
          <ul className="border-b border-line-strong">{rows(right)}</ul>
        </div>
      </div>
    </section>
  );
}
