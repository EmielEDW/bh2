import { NextResponse } from "next/server";
import { checkDevice } from "@/lib/store";
import { verify } from "@/lib/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hercontroleert bij het laden of een opgeslagen unlock nog geldig is:
// de token moet kloppen (HMAC) én het toestel moet nog geregistreerd zijn.
export async function POST(req: Request) {
  let body: { code?: string; deviceId?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const code = (body.code || "").trim().toUpperCase();
  const deviceId = (body.deviceId || "").trim();
  const token = (body.token || "").trim();
  if (!code || !deviceId || !token) return NextResponse.json({ ok: false });

  if (!verify(`${code}|${deviceId}`, token)) {
    return NextResponse.json({ ok: false });
  }
  try {
    const geldig = await checkDevice(code, deviceId);
    return NextResponse.json({ ok: geldig });
  } catch {
    // Bij een serverfout: niet uitsluiten (client valt terug op cache).
    return NextResponse.json({ ok: true, soft: true });
  }
}
