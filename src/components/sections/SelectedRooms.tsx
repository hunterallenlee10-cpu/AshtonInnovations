import Image from "next/image";
import { photoById } from "@/data/photos";
import { ProjectCaption } from "@/components/ui/Labels";

/*
  Real drywall and painting photos only (no AI images here), pinned up like
  prints on a studio wall: three staggered stacks on desktop, two on tablet,
  one alternating column on phones.
*/

type Item = { id: string; w: string; align: "start" | "end" };

// width is relative to its stack; alignment varies the rhythm
const stacks: Item[][] = [
  [
    { id: "drywall2", w: "100%", align: "start" },
    { id: "paint1", w: "74%", align: "end" },
    { id: "drywall6", w: "92%", align: "start" },
  ],
  [
    { id: "paint3", w: "86%", align: "end" },
    { id: "drywall4", w: "100%", align: "start" },
    { id: "paint2", w: "70%", align: "start" },
  ],
  [
    { id: "drywall1", w: "78%", align: "end" },
    { id: "drywall3", w: "100%", align: "start" },
    { id: "paint4", w: "84%", align: "end" },
    { id: "drywall5", w: "66%", align: "start" },
  ],
];

function Print({ item }: { item: Item }) {
  const p = photoById(item.id);
  return (
    <figure
      className={`group/print ${item.align === "end" ? "self-end" : "self-start"}`}
      style={{ width: item.w }}
    >
      <div className="relative transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/print:-translate-y-2">
        {/* deeper shadow fades in on hover (opacity only) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 shadow-[0_40px_70px_-30px_rgba(40,28,16,0.55)] transition-opacity duration-[700ms] group-hover/print:opacity-100"
        />
        <div className="print">
          <Image
            src={p.src}
            alt={p.alt}
            width={p.width}
            height={p.height}
            sizes="(max-width: 767px) 86vw, (max-width: 1279px) 44vw, 30vw"
            className="h-auto w-full"
          />
        </div>
      </div>
      <figcaption className="mt-3 transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/print:-translate-y-1">
        <ProjectCaption caption={p.caption} className="text-muted" />
      </figcaption>
    </figure>
  );
}

export function SelectedRooms() {
  const all = stacks.flat();
  // tablet: two stacks built from the same order
  const two: Item[][] = [all.filter((_, i) => i % 2 === 0), all.filter((_, i) => i % 2 === 1)];

  return (
    <section
      id="rooms"
      data-nav-theme="light"
      aria-labelledby="rooms-title"
      className="plaster-surface relative py-[clamp(96px,14vw,200px)] text-ink"
    >
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
        <h2 id="rooms-title" className="display text-[clamp(3rem,7vw,6.4rem)]">
          Selected rooms
        </h2>
        <p className="mt-6 max-w-[46ch] text-[clamp(17px,1.4vw,19px)] leading-relaxed text-muted">
          Real Ashton crews on real jobs: taping, sanding, protecting the room and painting it.
        </p>

        {/* phones: one column, alternating */}
        <div className="mt-16 flex flex-col gap-14 md:hidden">
          {all.map((it, i) => (
            <Print key={it.id} item={{ ...it, w: i % 3 === 1 ? "78%" : "88%", align: i % 2 ? "end" : "start" }} />
          ))}
        </div>

        {/* tablet: two staggered stacks */}
        <div className="mt-20 hidden grid-cols-2 gap-x-[clamp(28px,4vw,56px)] md:grid xl:hidden">
          {two.map((stack, s) => (
            <div key={s} className={`flex flex-col gap-[clamp(48px,7vw,88px)] ${s === 1 ? "pt-[18vw]" : ""}`}>
              {stack.map((it) => (
                <Print key={it.id} item={it} />
              ))}
            </div>
          ))}
        </div>

        {/* desktop: three staggered stacks */}
        <div className="mt-24 hidden grid-cols-3 gap-x-[clamp(32px,4vw,72px)] xl:grid">
          {stacks.map((stack, s) => (
            <div
              key={s}
              className={`flex flex-col gap-[clamp(64px,6vw,104px)] ${s === 1 ? "pt-[12vw]" : s === 2 ? "pt-[4vw]" : ""}`}
            >
              {stack.map((it) => (
                <Print key={it.id} item={it} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
