import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-3 text-xl font-bold text-slate-900">
        Deze pagina bestaat niet
      </h1>
      <p className="mt-1 text-slate-500">
        Misschien zocht je een thema of een rekening?
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Naar het dashboard
        </Link>
        <Link
          href="/mar"
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          MAR-zoeker
        </Link>
      </div>
    </div>
  );
}
