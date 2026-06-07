import { NextResponse } from "next/server";
import { stats } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// /api/admin/stats?secret=<ADMIN_SECRET>  -> hoeveel codes totaal/beschikbaar
export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || "";
  const admin = process.env.ADMIN_SECRET;
  if (!admin) return NextResponse.json({ error: "ADMIN_SECRET niet ingesteld." }, { status: 500 });
  if (secret !== admin) return NextResponse.json({ error: "Verkeerd admin-secret." }, { status: 401 });
  const s = await stats();
  if (!s) return NextResponse.json({ error: "KV niet geconfigureerd." }, { status: 500 });
  return NextResponse.json({ ok: true, ...s, gebruikt: s.total - s.available });
}
