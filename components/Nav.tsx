"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Item = { href: string; label: string; icon: string; desc?: string };

const PRIMARY: Item[] = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/samenvatting", label: "Samenvatting", icon: "📘" },
  { href: "/oefeningen", label: "Oefeningen", icon: "✍️" },
];

const MEER: Item[] = [
  { href: "/mar", label: "MAR-zoeker", icon: "🔢", desc: "Zoek elke rekening + debet/credit-trainer" },
  { href: "/boekingshulp", label: "Boekingshulp", icon: "🧭", desc: "Welke boeking? + journaalpost-builder" },
  { href: "/btw", label: "BTW", icon: "🧾", desc: "Rekenmachine, vakken & theorie" },
  { href: "/begrippen", label: "Begrippenlijst", icon: "📖", desc: "Alle begrippen uit de cursus" },
];

const EXAMEN: Item = { href: "/examen", label: "Examen", icon: "🎯" };

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [meerOpen, setMeerOpen] = useState(false);
  const meerRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const meerActive = MEER.some((m) => isActive(m.href));

  // sluit dropdown bij navigatie
  useEffect(() => {
    setMeerOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // sluit dropdown bij klik buiten
  useEffect(() => {
    if (!meerOpen) return;
    const handler = (e: MouseEvent) => {
      if (meerRef.current && !meerRef.current.contains(e.target as Node)) {
        setMeerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [meerOpen]);

  const linkCls = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "bg-brand-600 text-white shadow-sm shadow-brand-600/20"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-sm shadow-brand-600/30">
            B2
          </span>
          <span className="font-bold tracking-tight text-slate-900">
            Boekhouden&nbsp;2 <span className="text-brand-600">studie</span>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
          {PRIMARY.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls(isActive(l.href))}>
              {l.label}
            </Link>
          ))}

          <div className="relative" ref={meerRef}>
            <button
              onClick={() => setMeerOpen((o) => !o)}
              className={`flex items-center gap-1 ${linkCls(meerActive || meerOpen)}`}
              aria-expanded={meerOpen}
              aria-haspopup="menu"
            >
              Meer
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-200 ${meerOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {meerOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5"
              >
                {MEER.map((m) => (
                  <Link
                    key={m.href}
                    href={m.href}
                    role="menuitem"
                    className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      isActive(m.href) ? "bg-brand-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-lg leading-none">{m.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900">
                        {m.label}
                      </span>
                      {m.desc && (
                        <span className="block text-xs text-slate-500">{m.desc}</span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={EXAMEN.href} className={linkCls(isActive(EXAMEN.href))}>
            {EXAMEN.label}
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-1">
            {[...PRIMARY, EXAMEN].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(l.href) ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="mr-1.5">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
          <p className="mt-3 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Meer
          </p>
          <div className="mt-1 grid grid-cols-1 gap-1">
            {MEER.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(m.href) ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="mr-1.5">{m.icon}</span>
                {m.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
