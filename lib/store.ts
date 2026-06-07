// Opslag voor toegangscodes + toestel-registratie (Upstash Redis via REST).
//
// Datamodel:
//   bh2:codes               (set)  alle geldige codes
//   bh2:codes:available     (set)  nog niet via betaling uitgedeelde codes
//   bh2:code:<CODE>:devices (set)  geregistreerde device-id's voor die code (max 2)
//   bh2:code:<CODE>         (hash) { email, assignedAt }
import { Redis } from "@upstash/redis";
import { MAX_DEVICES } from "./access";

let _redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
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
    const n = await redis.scard(key);
    return { ok: true, devices: n };
  }

  const aantal = await redis.scard(key);
  if (aantal >= MAX_DEVICES) {
    return {
      ok: false,
      error: `Deze code is al op ${MAX_DEVICES} toestellen gebruikt.`,
    };
  }
  await redis.sadd(key, deviceId);
  return { ok: true, devices: aantal + 1 };
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
