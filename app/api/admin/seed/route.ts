import { NextResponse } from "next/server";
import { seedCodes } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Genereert nieuwe codes en zet ze in KV. Geeft de lijst terug (bewaar ze!).
// Gebruik (in de browser):
//   /api/admin/seed?secret=<ADMIN_SECRET>&count=200
async function handle(secret: string, count: number) {
  const admin = process.env.ADMIN_SECRET;
  if (!admin) {
    return NextResponse.json({ error: "ADMIN_SECRET niet ingesteld." }, { status: 500 });
  }
  if (secret !== admin) {
    return NextResponse.json({ error: "Verkeerd admin-secret." }, { status: 401 });
  }
  const n = Math.min(Math.max(count || 100, 1), 1000);
  const res = await seedCodes(n);
  if (!res) {
    return NextResponse.json({ error: "KV niet geconfigureerd." }, { status: 500 });
  }
  return NextResponse.json({
    ok: true,
    toegevoegd: res.codes.length,
    totaal: res.total,
    beschikbaar: res.available,
    codes: res.codes,
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  return handle(url.searchParams.get("secret") || "", parseInt(url.searchParams.get("count") || "100", 10));
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return handle(body.secret || "", parseInt(body.count || "100", 10));
}
