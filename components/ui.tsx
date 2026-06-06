import Link from "next/link";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-slate-900">{children}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function NatuurBadge({ natuur }: { natuur: string }) {
  const map: Record<string, string> = {
    debet: "bg-debet-bg text-debet",
    credit: "bg-credit-bg text-credit",
    beide: "bg-purple-50 text-purple-700",
  };
  const label: Record<string, string> = {
    debet: "Debet",
    credit: "Credit",
    beide: "Debet/Credit",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold ${
        map[natuur] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {label[natuur] ?? natuur}
    </span>
  );
}

export function NiveauBadge({ niveau }: { niveau: string }) {
  const map: Record<string, string> = {
    basis: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    midden: "bg-amber-50 text-amber-700 ring-amber-200",
    examen: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
        map[niveau] ?? "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {niveau}
    </span>
  );
}

export function KlasseBadge({ klasse }: { klasse: string }) {
  const colors = [
    "bg-slate-100 text-slate-700", // 0
    "bg-indigo-100 text-indigo-700", // 1
    "bg-sky-100 text-sky-700", // 2
    "bg-teal-100 text-teal-700", // 3
    "bg-emerald-100 text-emerald-700", // 4
    "bg-cyan-100 text-cyan-700", // 5
    "bg-rose-100 text-rose-700", // 6
    "bg-amber-100 text-amber-700", // 7
  ];
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
        colors[Number(klasse)] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {klasse}
    </span>
  );
}

export function Chip({
  children,
  color = "slate",
}: {
  children: ReactNode;
  color?: "slate" | "brand" | "amber" | "rose" | "emerald";
}) {
  const map: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    brand: "bg-brand-50 text-brand-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[color]}`}
    >
      {children}
    </span>
  );
}

export function MarChip({ code, naam }: { code: string; naam?: string }) {
  return (
    <Link
      href={`/mar?q=${code}`}
      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-brand-700 hover:bg-brand-50"
      title={naam}
    >
      {code}
      {naam && <span className="font-sans font-normal text-slate-500">· {naam}</span>}
    </Link>
  );
}
