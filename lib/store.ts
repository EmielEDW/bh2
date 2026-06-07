// Opslag voor toegangscodes + toestel-registratie.
// Gebruikt Vercel KV / Upstash (env: KV_REST_API_URL + KV_REST_API_TOKEN,
// met fallback naar UPSTASH_REDIS_REST_URL/-TOKEN).
//
// Datamodel:
//   bh2:codes               (set)  alle geldige codes
//   bh2:codes:available     (set)  nog niet via betaling uitgedeelde codes
//   bh2:code:<CODE>:devices (set)  geregistreerde device-id's voor die code
//   bh2:code:<CODE>         (hash) { email, assignedAt }
import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

export function maxDevices(): number {
  const n = parseInt(process.env.MAX_DEVICES || "2", 10);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

export type UnlockResult =
  | { ok: true; devices: number }
  | { ok: false; error: string };

/** Controleer een code en registreer (indien nodig) het toestel. */
export async function verifyAndRegister(
  code: string,
  deviceId: string
): Promise<UnlockResult> {
  const redis = getRedis();
  if (!redis) return { ok: false, error: "Server niet geconfigureerd." };
  if (!code || !deviceId) return { ok: false, error: "Code of toestel ontbreekt." };

  const bestaat = await redis.sismember("bh2:codes", code);
  if (!bestaat) return { ok: false, error: "Deze code bestaat niet." };

  const key = `bh2:code:${code}:devices`;
  const isDitToestel = await redis.sismember(key, deviceId);
  if (isDitToestel) {
    return { ok: true, devices: await redis.scard(key) };
  }

  const aantal = await redis.scard(key);
  if (aantal >= maxDevices()) {
    return {
      ok: false,
      error: `Deze code is al op ${maxDevices()} toestellen gebruikt.`,
    };
  }
  await redis.sadd(key, deviceId);
  return { ok: true, devices: aantal + 1 };
}

/** Read-only: bestaat de code én is dit toestel geregistreerd? (voor /api/verify) */
export async function checkDevice(code: string, deviceId: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis || !code || !deviceId) return false;
  const bestaat = await redis.sismember("bh2:codes", code);
  if (!bestaat) return false;
  return (await redis.sismember(`bh2:code:${code}:devices`, deviceId)) === 1;
}

/** Pak een ongebruikte code (bij een betaling) en koppel ze aan het e-mailadres. */
export async function claimCode(email: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  const code = (await redis.spop("bh2:codes:available")) as string | null;
  if (!code) return null;
  await redis.hset(`bh2:code:${code}`, {
    email,
    assignedAt: new Date().toISOString(),
  });
  return code;
}

/** Genereer en bewaar nieuwe codes (admin). Geeft de nieuwe codes terug. */
const ALFABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // zonder 0/O, 1/I
function deel(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += ALFABET[Math.floor(Math.random() * ALFABET.length)];
  return s;
}
export async function seedCodes(count: number): Promise<{ codes: string[]; total: number; available: number } | null> {
  const redis = getRedis();
  if (!redis) return null;
  const nieuw = new Set<string>();
  while (nieuw.size < count) nieuw.add(`BH2-${deel(4)}-${deel(4)}`);
  const lijst = [...nieuw];
  for (let i = 0; i < lijst.length; i += 50) {
    const batch = lijst.slice(i, i + 50);
    await redis.sadd("bh2:codes", batch[0], ...batch.slice(1));
    await redis.sadd("bh2:codes:available", batch[0], ...batch.slice(1));
  }
  return {
    codes: lijst,
    total: await redis.scard("bh2:codes"),
    available: await redis.scard("bh2:codes:available"),
  };
}

/** Statistieken (admin). */
export async function stats(): Promise<{ total: number; available: number } | null> {
  const redis = getRedis();
  if (!redis) return null;
  return {
    total: await redis.scard("bh2:codes"),
    available: await redis.scard("bh2:codes:available"),
  };
}
