// No real reviews exist yet. These are clearly marked placeholders for the
// owner to replace. Never put invented review text here.

const placeholders = [
  { who: "[Homeowner or builder]" },
  { who: "[Homeowner or builder]" },
];

export function Proof() {
  return (
    <section
      id="proof"
      data-nav-theme="light"
      aria-labelledby="proof-title"
      className="relative bg-plaster py-[clamp(88px,12vw,176px)] text-ink"
    >
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
        <h2 id="proof-title" className="display text-[clamp(2.6rem,5.4vw,4.8rem)]">
          Client reviews
        </h2>
        <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-muted">
          These two spaces are waiting for real words from Ashton clients. Nothing here is a real review yet.
        </p>

        <div className="mt-[clamp(48px,7vw,96px)] grid gap-8 md:grid-cols-2 md:gap-[clamp(32px,5vw,80px)]">
          {placeholders.map((p, i) => (
            <figure
              key={i}
              className={`relative border border-dashed border-ink/30 bg-plaster-2/60 p-[clamp(28px,4vw,56px)] ${
                i === 1 ? "md:mt-[clamp(48px,8vw,128px)]" : ""
              }`}
            >
              <p className="annot inline-block border border-dashed border-ink/40 px-2.5 py-1 text-ink/70">
                Sample: replace with a real client review
              </p>
              <blockquote className="display mt-8 text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.15] text-ink/55">
                [Client review: one to three sentences about the room, the crew and the finish.]
              </blockquote>
              <figcaption className="mt-8 border-t border-dashed border-ink/25 pt-5 text-[15px] text-ink/65">
                <span className="block">[Client name], [Town]</span>
                <span className="annot mt-1 block text-ink/65">{p.who}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
