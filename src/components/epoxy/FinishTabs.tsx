"use client";

import { useRef, type KeyboardEvent } from "react";
import { Confirm } from "@/components/ui/Confirm";
import { FINISHES, type Finish } from "./finishes";

// Accessible tablist (arrow keys, Home/End). The tabpanel is the pour stage.
export function FinishTabs({
  value,
  onChange,
  panelId,
}: {
  value: Finish;
  onChange: (f: Finish) => void;
  panelId: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = FINISHES.length - 1;
    let n = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = i === 0 ? last : i - 1;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = last;
    else return;
    e.preventDefault();
    onChange(FINISHES[n].id);
    refs.current[n]?.focus();
  };

  return (
    <div>
      <p id="finish-label" className="annot text-plaster/60">
        Finish
      </p>
      <div
        role="tablist"
        aria-labelledby="finish-label"
        className="mt-3 grid grid-cols-3 border border-line-light-strong bg-ink-3/40 backdrop-blur-sm"
      >
        {FINISHES.map((f, i) => {
          const on = value === f.id;
          return (
            <button
              key={f.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`finish-tab-${f.id}`}
              aria-selected={on}
              aria-controls={panelId}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(f.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`relative flex min-h-16 flex-col items-start gap-2 px-3 py-3 text-left transition-colors duration-300 sm:flex-row sm:items-center sm:gap-3 sm:px-4 ${
                i > 0 ? "border-l border-line-light-strong" : ""
              } ${on ? "bg-plaster/[0.09] text-plaster" : "text-plaster/70 hover:bg-plaster/[0.04] hover:text-plaster"}`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-[2px] origin-left bg-red transition-transform duration-500 ${
                  on ? "scale-x-100" : "scale-x-0"
                }`}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.swatch}
                alt=""
                width={28}
                height={28}
                loading="lazy"
                className="size-7 shrink-0 object-cover outline outline-1 outline-plaster/20"
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[16px] font-medium leading-tight">{f.label}</span>
                <span className="text-[13px] leading-snug text-plaster/60">
                  <Confirm note={`Owner to confirm Ashton offers a ${f.note.toLowerCase()} finish`}>
                    <span className="sr-only">{f.note}</span>
                  </Confirm>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
