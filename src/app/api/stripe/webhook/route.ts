// app/api/stripe/webhook/route.ts

import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing stripe signature", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✅ Handle subscription completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const customerEmail = session.customer_email;
    const customerId = session.customer;

    console.log("✅ Payment success for:", customerEmail);

    if (customerEmail) {
      await prisma.user.update({
        where: { email: customerEmail },
        data: {
          subscription_status: "ACTIVE",
          stripeCustomerId: customerId,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
