#!/usr/bin/env node
// Genereert toegangscodes en laadt ze in Upstash Redis.
//
// Gebruik:
//   node scripts/seed-codes.mjs 200      (genereert 200 nieuwe codes)
//
// Vereist UPSTASH_REDIS_REST_URL en UPSTASH_REDIS_REST_TOKEN
// (uit .env.local of uit de omgeving).
import { Redis } from "@upstash/redis";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

// .env.local inladen (eenvoudige parser)
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) {
  console.error("❌ KV_REST_API_URL en KV_REST_API_TOKEN ontbreken (of de UPSTASH_*-varianten).");
  console.error("   Tip: makkelijker is de admin-route /api/admin/seed op de live site.");
  process.exit(1);
}

const aantal = parseInt(process.argv[2] || "100", 10);
const ALFABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // zonder verwarrende tekens (0/O, 1/I)

function deel(n) {
  let s = "";
  for (let i = 0; i < n; i++) s += ALFABET[Math.floor(Math.random() * ALFABET.length)];
  return s;
}
function nieuweCode() {
  return `BH2-${deel(4)}-${deel(4)}`;
}

const redis = new Redis({ url, token });

const codes = new Set();
while (codes.size < aantal) codes.add(nieuweCode());
const lijst = [...codes];

// in batches toevoegen
for (let i = 0; i < lijst.length; i += 50) {
  const batch = lijst.slice(i, i + 50);
  await redis.sadd("bh2:codes", ...batch);
  await redis.sadd("bh2:codes:available", ...batch);
}

const totaal = await redis.scard("bh2:codes");
const beschikbaar = await redis.scard("bh2:codes:available");

// backup wegschrijven (gitignored)
const backup = "_codes-backup.txt";
const bestaand = existsSync(backup) ? readFileSync(backup, "utf8") : "";
writeFileSync(backup, bestaand + lijst.join("\n") + "\n");

console.log(`✅ ${lijst.length} codes toegevoegd.`);
console.log(`   Totaal in 'bh2:codes': ${totaal} | beschikbaar: ${beschikbaar}`);
console.log(`   Backup van deze batch staat in ${backup}`);
console.log("\nEnkele voorbeelden:");
console.log("  " + lijst.slice(0, 5).join("\n  "));
