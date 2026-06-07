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
import crypto from "crypto";

// Master-code: onbeperkt aantal toestellen, werkt altijd (ook zonder KV).
// We bewaren enkel de SHA-256-hash zodat de echte code niet in de (publieke)
// repo staat. Optioneel kan je ook MASTER_CODE als env-var zetten.
const MASTER_HASH = "7385f52e23f03cc969c04aae4312477c26bb25a22167c3a983c8899c354b1207";

export function isMaster(code: string): boolean {
  if (!code) return false;
  const c = code.trim().toUpperCase();
  const envMaster = process.env.MASTER_CODE?.trim().toUpperCase();
  if (envMaster && c === envMaster) return true;
  return crypto.createHash("sha256").update(c).digest("hex") === MASTER_HASH;
}

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
  if (!code || !deviceId) return { ok: false, error: "Code of toestel ontbreekt." };

  // Master-code: altijd geldig, onbeperkt aantal toestellen, geen KV nodig.
  if (isMaster(code)) return { ok: true, devices: 0 };

  const redis = getRedis();
  if (!redis) return { ok: false, error: "Server niet geconfigureerd." };

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
  if (!code || !deviceId) return false;
  if (isMaster(code)) return true; // master blijft altijd geldig
  const redis = getRedis();
  if (!redis) return false;
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
