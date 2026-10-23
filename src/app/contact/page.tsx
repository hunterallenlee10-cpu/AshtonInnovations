import type { Metadata } from "next";
import { business, CTA_LABEL } from "@/data/business";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { Footer } from "@/components/sections/Footer";

const title = "Request a Design Consultation | Ashton Innovations";
const description =
  "Request a design consultation with Ashton Innovations: decorative drywall, painting and epoxy floors in Fredericksburg, Stafford and Spotsylvania, Virginia.";

// Metadata merges shallowly, so restate the share image here.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Ashton Innovations",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ashton Innovations: a tray ceiling rendered above a metallic epoxy floor.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return (
    <>
      <main id="main">
        <section
          id="contact-top"
          data-nav-theme="light"
          aria-labelledby="contact-title"
          className="plaster-surface relative pb-[clamp(96px,12vw,176px)] pt-[calc(var(--nav-h)+clamp(48px,7vw,104px))] text-ink"
        >
          <div className="blueprint-grid blueprint-grid-faint pointer-events-none absolute inset-x-0 top-0 h-[60vh]" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1440px] px-[var(--gutter)]">
            <p className="annot text-muted">
              Sheet C-1 <span aria-hidden="true">/</span> Consultation request
            </p>
            <h1 id="contact-title" className="display mt-5 max-w-[13ch] text-[clamp(3.2rem,8vw,7rem)] leading-[0.92]">
              {CTA_LABEL}
            </h1>
            <p className="mt-7 max-w-[44ch] text-[clamp(17px,1.4vw,19px)] leading-relaxed text-muted">
              Tell us about the house, the room and the look you have in mind. Ceilings, walls, paint or the floor below.
            </p>

            <div className="mt-[clamp(56px,7vw,96px)] grid gap-x-[clamp(40px,7vw,128px)] gap-y-20 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="border-t border-line-strong pt-10">
                <ConsultForm variant="page" />
              </div>

              <aside aria-label="Contact details" className="border-t border-line-strong pt-10">
                <dl className="grid gap-10">
                  <div>
                    <dt className="annot text-muted">Call the office</dt>
                    <dd className="mt-2">
                      <a
                        href={business.phone.href}
                        className="display inline-flex min-h-11 items-center text-[clamp(2.2rem,3.4vw,3rem)] leading-none tabular-nums underline decoration-red decoration-1 underline-offset-[8px]"
                      >
                        {business.phone.display}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="annot text-muted">Service area</dt>
                    <dd className="mt-3">
                      <ul className="text-[18px] leading-[1.7]">
                        {business.serviceArea.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      <p className="mt-1 text-[15px] text-muted">{business.serviceRegion}</p>
                    </dd>
                  </div>
                  <div>
                    <dt className="annot text-muted">Mailing</dt>
                    <dd className="mt-3 text-[18px] leading-relaxed">
                      {business.legalName}
                      <br />
                      {business.mailing.line1}
                      <br />
                      {business.mailing.line2}
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
