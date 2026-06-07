import crypto from "crypto";

// Tekent/valideert een korte token zodat de client een unlock niet kan vervalsen.
function secret(): string {
  return process.env.HMAC_SECRET || "dev-onveilig-secret";
}

export function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function verify(payload: string, token: string): boolean {
  if (!token) return false;
  const expected = sign(payload);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
