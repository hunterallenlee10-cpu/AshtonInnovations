"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react/dist/ssr";
import type { Photo } from "@/data/photos";
import { ProjectCaption } from "@/components/ui/Labels";
import { setScrollLocked } from "@/components/providers/SmoothScroll";

const noop = () => () => {};

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export function GalleryModal({
  title,
  photos,
  index,
  onIndex,
  onClose,
}: {
  title: string;
  photos: Photo[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [dir, setDir] = useState(1);
  const i = index ?? 0;
  const photo = photos[i];

  const go = (delta: number) => {
    if (index === null) return;
    setDir(delta);
    onIndex((index + delta + photos.length) % photos.length);
  };

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    setScrollLocked(true);
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-close]")?.focus(), 50);
    return () => {
      window.clearTimeout(t);
      setScrollLocked(false);
      opener.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && panel.current) {
        const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && photo && (
        <motion.div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={`${title}: Ashton project photos`}
          className="on-ink fixed inset-0 z-[85] flex flex-col bg-ink/96 text-plaster backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.4 }}
          data-lenis-prevent
        >
          <div className="flex items-center justify-between gap-4 px-[var(--gutter)] py-4">
            <p className="annot text-plaster/70">
              {title} <span aria-hidden="true">/</span> {i + 1} of {photos.length}
            </p>
            <button
              type="button"
              data-close
              onClick={onClose}
              className="-mr-2 grid size-11 place-items-center hover:text-red"
              aria-label="Close gallery"
            >
              <X size={26} weight="light" />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-[var(--gutter)]"
            onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
            onTouchEnd={(e) => {
              if (!touch.current) return;
              const dx = e.changedTouches[0].clientX - touch.current.x;
              const dy = e.changedTouches[0].clientY - touch.current.y;
              touch.current = null;
              if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
            }}
          >
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.figure
                key={photo.id}
                custom={dir}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex max-h-full w-full max-w-[min(78vh,92vw)] flex-col"
              >
                <div className="print">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 768px) 92vw, 78vh"
                    className="h-auto max-h-[70vh] w-full object-contain"
                  />
                </div>
                <figcaption className="mt-4">
                  <ProjectCaption caption={photo.caption} className="text-plaster/80" />
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-[var(--gutter)] top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-line-light-strong bg-ink/60 transition-colors hover:border-plaster max-sm:top-auto max-sm:bottom-2 max-sm:translate-y-0"
                  aria-label="Previous photo"
                >
                  <ArrowLeft size={20} weight="light" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-[var(--gutter)] top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-line-light-strong bg-ink/60 transition-colors hover:border-plaster max-sm:top-auto max-sm:bottom-2 max-sm:translate-y-0"
                  aria-label="Next photo"
                >
                  <ArrowRight size={20} weight="light" />
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto px-[var(--gutter)] py-5" aria-label="All photos">
            {photos.map((p, k) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setDir(k > i ? 1 : -1);
                  onIndex(k);
                }}
                aria-label={`Show photo ${k + 1}: ${p.caption}`}
                aria-current={k === i ? "true" : undefined}
                className={`relative size-14 shrink-0 overflow-hidden border transition-opacity ${
                  k === i ? "border-plaster opacity-100" : "border-transparent opacity-50 hover:opacity-90"
                }`}
              >
                <Image src={p.src} alt="" width={112} height={112} sizes="56px" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
