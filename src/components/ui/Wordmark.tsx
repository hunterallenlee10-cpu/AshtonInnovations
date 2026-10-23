// Typeset wordmark plus a small mark echoing Ashton's original logo:
// a red brush stroke that runs into a putty-knife blade.

export function BrushMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 46 18" className={className} aria-hidden="true" focusable="false">
      <path
        d="M1.2 15.6C8.6 14.4 17.4 11.2 27.6 7.1c.8-.3 1.5.9.7 1.3C18.6 13 9.5 16.3 1.6 17.4c-1 .1-1.4-1.6-.4-1.8Z"
        fill="var(--red)"
      />
      <path d="M28.6 5.2 43.8 1.6c.6-.1 1.1.3 1.1.9v6.9c0 .6-.6 1-1.2.8L29 7.6Z" fill="currentColor" opacity="0.92" />
      <path d="M31.2 5.4 43 2.8" stroke="var(--plaster)" strokeOpacity="0.35" strokeWidth="0.6" />
    </svg>
  );
}

export function Wordmark({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrushMark className="h-[14px] w-auto shrink-0" />
      <span className="font-sans text-[13px] font-semibold tracking-[0.22em] whitespace-nowrap">
        ASHTON{compact ? "" : " INNOVATIONS"}
      </span>
    </span>
  );
}
