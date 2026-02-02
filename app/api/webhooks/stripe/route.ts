import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, {
            status: 400,
        });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const companyId = session.metadata?.companyId;

        if (companyId) {
            await supabaseAdmin
                .from("companies")
                .update({
                    subscription_status: "active",
                    stripe_customer_id: session.customer as string,
                    stripe_subscription_id: session.subscription as string,
                })
                .eq("id", companyId);

            console.log(`✅ Company ${companyId} activated!`);
        }
    }

    return new NextResponse(null, { status: 200 });
}
