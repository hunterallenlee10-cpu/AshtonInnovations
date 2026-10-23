"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react/dist/ssr";
import type { ProjectType } from "@/data/business";
import { CTA_LABEL } from "@/data/business";
import { setScrollLocked } from "@/components/providers/SmoothScroll";
import { ConsultForm } from "./ConsultForm";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ConsultModal({
  open,
  preselect,
  formKey,
  onClose,
}: {
  open: boolean;
  preselect?: ProjectType;
  formKey: number;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);

    const panel = panelRef.current;
    // Focus the first field once the panel is in.
    const t = window.setTimeout(() => {
      const first = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
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
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      setScrollLocked(false);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consult-title"
            className="plaster-surface absolute inset-y-0 right-0 flex w-full max-w-[680px] flex-col text-ink shadow-[0_0_80px_rgba(0,0,0,0.35)]"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-6 border-b border-line px-[var(--gutter)] pb-6 pt-7 sm:px-10">
              <div>
                <p className="annot text-muted">Sheet C-1 / Consultation request</p>
                <h2 id="consult-title" className="display mt-3 text-[clamp(2.2rem,5vw,3.4rem)]">
                  {CTA_LABEL}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 grid size-11 shrink-0 place-items-center text-ink transition-colors hover:text-red"
                aria-label="Close consultation form"
              >
                <X size={24} weight="light" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-[var(--gutter)] pb-10 pt-8 sm:px-10" data-lenis-prevent>
              <ConsultForm key={formKey} preselect={preselect} onDone={onClose} variant="modal" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
