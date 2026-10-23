"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { List, Phone, X } from "@phosphor-icons/react/dist/ssr";
import { business, navLinks } from "@/data/business";
import { Wordmark } from "@/components/ui/Wordmark";
import { CtaButton } from "@/components/consult/CtaButton";
import { onHomeLinkClick, scrollToTarget, setScrollLocked } from "@/components/providers/SmoothScroll";

export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  // Restyle from whichever section sits under the nav (ScrollTrigger, no scroll
  // listener, no React re-render).
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const set = (s: HTMLElement) => {
      nav.dataset.theme = s.dataset.navTheme ?? "light";
      nav.dataset.solid = s.id === "top" ? "0" : "1";
    };
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme]")).map((s) =>
      ScrollTrigger.create({
        trigger: s,
        start: "top 34px",
        end: "bottom 34px",
        // measure after the pinned sections have added their spacing
        refreshPriority: -10,
        onToggle: (self) => self.isActive && set(s),
      }),
    );
    const active = triggers.find((t) => t.isActive);
    if (active) set(active.trigger as HTMLElement);
    return () => triggers.forEach((t) => t.kill());
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      setScrollLocked(false);
    };
  }, [menuOpen]);

  const onAnchor = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    if (!href.startsWith("/#") || pathname !== "/") return;
    const el = document.querySelector(href.slice(1));
    if (!el) return;
    e.preventDefault();
    history.replaceState(null, "", href.slice(1));
    // wait for the menu's scroll lock to release
    requestAnimationFrame(() => scrollToTarget(el as HTMLElement));
  };

  return (
    <>
      <header
        ref={navRef}
        data-theme="dark"
        data-solid="0"
        className="group/nav fixed inset-x-0 top-0 z-50 text-plaster transition-colors duration-500 data-[theme=light]:text-ink"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 border-b opacity-0 backdrop-blur-md transition-opacity duration-500 group-data-[solid=1]/nav:opacity-100 group-data-[theme=dark]/nav:border-line-light group-data-[theme=dark]/nav:bg-ink/72 group-data-[theme=light]/nav:border-line group-data-[theme=light]/nav:bg-plaster/80"
        />
        <nav
          aria-label="Main"
          className="relative mx-auto flex h-[var(--nav-h)] items-center justify-between gap-6 px-[var(--gutter)]"
        >
          <Link
            href="/"
            onClick={(e) => onHomeLinkClick(e, pathname)}
            className="-my-2 flex min-h-11 items-center py-2"
            aria-label="Ashton Innovations, home"
          >
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={(e) => onAnchor(e, l.href)}
                  className="annot relative py-3 opacity-80 transition-opacity hover:opacity-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <a
              href={business.phone.href}
              className="hidden min-h-11 items-center gap-2 text-[14px] tabular-nums opacity-90 transition-opacity hover:opacity-100 md:flex"
            >
              <Phone size={16} weight="light" aria-hidden="true" />
              {business.phone.display}
            </a>
            <CtaButton compact className="hidden sm:inline-flex" />
            <button
              type="button"
              className="-mr-2 grid size-11 place-items-center lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <List size={26} weight="light" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="plaster-surface fixed inset-0 z-[70] flex flex-col text-ink"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0 : 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="flex h-[var(--nav-h)] items-center justify-between px-[var(--gutter)]">
              <Wordmark />
              <button
                type="button"
                className="-mr-2 grid size-11 place-items-center"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                autoFocus
              >
                <X size={26} weight="light" />
              </button>
            </div>
            <ul className="blueprint-grid blueprint-grid-faint flex-1 px-[var(--gutter)] pt-8">
              {navLinks.map((l) => (
                <li key={l.href} className="border-b border-line">
                  <Link
                    href={l.href}
                    onClick={(e) => onAnchor(e, l.href)}
                    className="flex items-baseline justify-between py-4"
                  >
                    <span className="display text-[clamp(2.4rem,10vw,3.4rem)]">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="grid gap-4 px-[var(--gutter)] pb-10 pt-6">
              <a href={business.phone.href} className="flex min-h-11 items-center gap-2 text-[18px] tabular-nums">
                <Phone size={18} weight="light" aria-hidden="true" />
                {business.phone.display}
              </a>
              <CtaButton className="w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
