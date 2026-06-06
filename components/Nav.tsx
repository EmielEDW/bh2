"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/samenvatting", label: "Samenvatting", icon: "📘" },
  { href: "/oefeningen", label: "Oefeningen", icon: "✍️" },
  { href: "/mar", label: "MAR-zoeker", icon: "🔢" },
  { href: "/boekingshulp", label: "Boekingshulp", icon: "🧭" },
  { href: "/btw", label: "BTW", icon: "🧾" },
  { href: "/flashcards", label: "Flashcards", icon: "🎴" },
  { href: "/examen", label: "Examen", icon: "🎯" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
            B2
          </span>
          <span className="font-bold tracking-tight text-slate-900">
            Boekhouden&nbsp;2 <span className="text-brand-600">studie</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isActive(l.href)
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="grid grid-cols-2 gap-1 border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                isActive(l.href)
                  ? "bg-brand-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="mr-1.5">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
