"use server";

import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
});

export async function createCheckoutSession(companyId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user || !user.email) return { error: "Unauthorized" };

    const { data: company } = await supabase
        .from("companies")
        .select("stripe_customer_id")
        .eq("id", companyId)
        .eq("owner_id", user.id)
        .single();

    if (!company) return { error: "Company not found" };

    let customerParams = {};
    if (company.stripe_customer_id) {
        customerParams = { customer: company.stripe_customer_id };
    } else {
        customerParams = { customer_email: user.email };
    }

    const session = await stripe.checkout.sessions.create({
        ...customerParams,
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "DSAR Portal Subscription",
                        description: "Monthly access to privacy tools",
                    },
                    unit_amount: 1000,
                    recurring: {
                        interval: "month",
                    },
                },
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/owner/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/owner/dashboard`,
        metadata: {
            companyId: companyId,
            userId: user.id,
        },
    });

    if (!session.url) return { error: "Failed to create checkout session" };

    redirect(session.url);
}
