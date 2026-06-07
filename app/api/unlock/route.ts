import { NextResponse } from "next/server";
import { verifyAndRegister } from "@/lib/store";
import { sign } from "@/lib/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { code?: string; deviceId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const code = (body.code || "").trim().toUpperCase();
  const deviceId = (body.deviceId || "").trim();
  if (!code || !deviceId) {
    return NextResponse.json({ ok: false, error: "Code of toestel ontbreekt." }, { status: 400 });
  }

  try {
    const result = await verifyAndRegister(code, deviceId);
    if (!result.ok) {
      return NextResponse.json(result, { status: 403 });
    }
    const token = sign(`${code}|${deviceId}`);
    return NextResponse.json({ ok: true, token });
  } catch (e) {
    console.error("unlock error", e);
    return NextResponse.json(
      { ok: false, error: "Er ging iets mis bij het controleren." },
      { status: 500 }
    );
  }
}
