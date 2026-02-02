"use server";

import { createClient } from "@/lib/supabase/server";
import { requestSchema } from "@/schemas";

export async function submitRequest(companyId: string, formData: FormData) {
    try {
        const supabase = await createClient();

        const validatedFields = requestSchema.safeParse({
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            details:
                formData.get("request_details") || formData.get("request_text"),
        });

        if (!validatedFields.success) {
            return { error: "Please check your inputs and try again." };
        }

        const { data } = validatedFields;

        const { error } = await supabase.from("dsar_requests").insert({
            company_id: companyId,
            requester_name: data.name,
            requester_email: data.email,
            requester_phone: data.phone,
            request_details: data.details,
            status: "open",
        });

        if (error) {
            return { error: "Failed to submit request" };
        }

        console.log(`[EMAIL STUB] Notification sent to ${data.email}`);

        return { success: true };
    } catch (err) {
        console.error("submitRequest crashed:", err);
        return { error: "Something went wrong. Please try again later." };
    }
}
