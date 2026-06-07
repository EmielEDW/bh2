import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { claimCode } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE =
  process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://bh2.emieldewaele.com";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!secret || !stripeKey) {
    return NextResponse.json({ error: "Stripe niet geconfigureerd." }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const sig = req.headers.get("stripe-signature") || "";
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("Webhook handtekening ongeldig", e);
    return NextResponse.json({ error: "Ongeldige handtekening." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Deel je één Stripe-account met je andere sites? Zet STRIPE_PAYMENT_LINK_ID
    // (de 'plink_...'-id van DEZE pack) zodat we enkel betalingen voor BH2 verwerken.
    const onlyLink = process.env.STRIPE_PAYMENT_LINK_ID;
    if (onlyLink && session.payment_link && session.payment_link !== onlyLink) {
      return NextResponse.json({ received: true, skipped: "ander product" });
    }

    const email =
      session.customer_details?.email || (session.customer_email as string) || "";

    if (!email) {
      console.error("Geen e-mailadres in checkout-sessie", session.id);
      return NextResponse.json({ received: true });
    }

    try {
      const code = await claimCode(email);
      if (!code) {
        console.error("⚠️ GEEN CODES MEER BESCHIKBAAR voor", email);
        await notifyAdmin(`Geen codes meer! Betaling van ${email} (sessie ${session.id}) kreeg geen code.`);
        return NextResponse.json({ received: true });
      }
      await sendCodeEmail(email, code);
    } catch (e) {
      console.error("Fout bij toekennen/mailen code", e);
      return NextResponse.json({ error: "Interne fout." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function sendCodeEmail(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Boekhouden 2 <info@emieldewaele.com>";
  const replyTo = process.env.REPLY_TO_EMAIL || "info@emieldewaele.com";
  if (!apiKey) {
    console.error("RESEND_API_KEY ontbreekt — code voor", email, "is:", code);
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: email,
    replyTo,
    subject: "Je toegangscode voor Boekhouden 2 🎓",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#1e293b">
        <h2 style="color:#1e66f0">Bedankt voor je aankoop! 🎉</h2>
        <p>Hier is je persoonlijke toegangscode voor de volledige Boekhouden 2-pack:</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:2px;background:#eef4ff;color:#1750dc;padding:14px;border-radius:12px;text-align:center;font-family:monospace">${code}</p>
        <p><strong>Zo ontgrendel je:</strong></p>
        <ol>
          <li>Ga naar <a href="${SITE}" style="color:#1e66f0">${SITE.replace(/^https?:\/\//, "")}</a></li>
          <li>Klik op <strong>🔓 Pro</strong> (of "Ik heb al een code").</li>
          <li>Vul je code in. Klaar!</li>
        </ol>
        <p style="color:#64748b;font-size:14px">Eén code werkt op <strong>maximaal 2 toestellen</strong>. Bewaar deze e-mail goed.</p>
        <p style="color:#94a3b8;font-size:12px">Veel succes met studeren! — Boekhouden 2</p>
      </div>`,
  });
}

async function notifyAdmin(message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const admin =
    process.env.ADMIN_EMAIL || process.env.REPLY_TO_EMAIL || "info@emieldewaele.com";
  const from = process.env.RESEND_FROM || "Boekhouden 2 <info@emieldewaele.com>";
  if (!apiKey) return;
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({ from, to: admin, subject: "⚠️ BH2: codes op?", text: message });
  } catch {}
}
