import Image from "next/image";
import { services, type Service } from "@/data/services";
import { photoById } from "@/data/photos";
import { ProjectCaption, RenderLabel } from "@/components/ui/Labels";

/*
  Editorial two-column index. Each row shows its photo (or render) on the
  right, always visible, with its caption under the description.
*/

function Thumb({ s }: { s: Service }) {
  const v = s.visual;
  return (
    <div className="relative aspect-square w-[clamp(88px,10.5vw,152px)] shrink-0">
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
  );
}

function Row({ s }: { s: Service }) {
  const v = s.visual;
  const caption =
    v.kind === "photo" ? (
      <ProjectCaption caption={photoById(v.photoId).caption} className="text-muted" />
    ) : (
      <RenderLabel className="text-muted" />
    );

  return (
    <li className="grid grid-cols-[1fr_auto] items-start gap-x-6 border-t border-line-strong py-7 md:gap-x-10 md:py-9">
      <div className="min-w-0">
        <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="display text-[clamp(1.85rem,3.1vw,2.9rem)] leading-[1.02]">{s.name}</span>
          {s.isNew && (
            <span className="annot translate-y-[-0.3em] border border-red px-2 py-0.5 text-red">New</span>
          )}
        </h3>
        <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-muted">{s.description}</p>
        <p className="mt-4">{caption}</p>
      </div>
      <Thumb s={s} />
    </li>
  );
}

export function Services() {
  const left = services.slice(0, 3);
  const right = services.slice(3);
  const rows = (list: Service[]) => list.map((s) => <Row key={s.id} s={s} />);

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
