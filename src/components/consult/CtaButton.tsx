"use client";

import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CTA_LABEL, type ProjectType } from "@/data/business";
import { useConsult } from "./ConsultProvider";

// The one CTA on the site. Every instance opens the same modal.
export function CtaButton({
  preselect,
  className = "",
  compact = false,
}: {
  preselect?: ProjectType;
  className?: string;
  compact?: boolean;
}) {
  const { open } = useConsult();
  return (
    <button
      type="button"
      onClick={() => open(preselect)}
      className={`btn-red ${compact ? "!min-h-11 !px-4 !text-[14px]" : ""} ${className}`}
      aria-haspopup="dialog"
    >
      {CTA_LABEL}
      {!compact && <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />}
    </button>
  );
}
