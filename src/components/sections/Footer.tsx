"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { business, navLinks } from "@/data/business";
import { Wordmark } from "@/components/ui/Wordmark";
import { scrollToTarget } from "@/components/providers/SmoothScroll";

export function Footer() {
  const pathname = usePathname();

  // In-page anchors glide on the home page; "Contact" is a real route and
  // lands at the top of /contact (the scroll provider resets on route change).
  const onAnchor = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("/#") || pathname !== "/") return;
    const el = document.querySelector(href.slice(1));
    if (!el) return;
    e.preventDefault();
    history.replaceState(null, "", href.slice(1));
    scrollToTarget(el as HTMLElement);
  };

  return (
    <footer
      id="footer"
      data-nav-theme="dark"
      className="on-ink relative bg-ink-2 text-plaster"
    >
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pb-10 pt-[clamp(72px,9vw,128px)]">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex min-h-11 items-center" aria-label="Ashton Innovations, home">
              <Wordmark />
            </Link>
            <p className="display mt-6 max-w-[16ch] text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.02]">
              {business.tagline}
            </p>
            <p className="mt-6 text-[15px] text-plaster/70">{business.legalName}</p>
          </div>

          <nav aria-label="Footer">
            <p className="annot text-plaster/55">Site</p>
            <ul className="mt-4">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={(e) => onAnchor(e, l.href)}
                    className="inline-flex min-h-11 items-center text-[16px] text-plaster/85 transition-colors hover:text-plaster"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="annot text-plaster/55">Service area</p>
            <ul className="mt-4 grid gap-1 text-[16px] text-plaster/85">
              {business.serviceArea.map((t) => (
                <li key={t} className="flex min-h-11 items-center">
                  {t}
                </li>
              ))}
              <li className="flex min-h-11 items-center text-plaster/60">{business.serviceRegion}</li>
            </ul>
          </div>

          <div>
            <p className="annot text-plaster/55">Contact</p>
            <a
              href={business.phone.href}
              className="mt-4 inline-flex min-h-11 items-center text-[20px] tabular-nums underline decoration-red decoration-1 underline-offset-[6px]"
            >
              {business.phone.display}
            </a>
            <address className="mt-4 text-[16px] not-italic leading-relaxed text-plaster/85">
              {business.mailing.line1}
              <br />
              {business.mailing.line2}
            </address>
          </div>
        </div>

        <div className="mt-[clamp(56px,8vw,112px)] flex flex-col gap-3 border-t border-line-light pt-6 text-[13px] text-plaster/60 md:flex-row md:items-center md:justify-between">
          <p>© {business.legalName}</p>
          <p>{business.conceptCredit}</p>
        </div>
      </div>
    </footer>
  );
}
