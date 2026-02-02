"use server";

import { RequestStatus } from "@/constants";
import { createClient } from "@/lib/supabase/server";
import { companySchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export async function registerCompany(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const validatedFields = companySchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        region: formData.get("region"),
        address: formData.get("address"),
        contact_email: formData.get("contact_email"),
        contact_phone: formData.get("contact_phone"),
        logo_url: formData.get("logo_url"),
    });

    if (!validatedFields.success) {
        return { error: "Please check your inputs and try again." };
    }

    const { data } = validatedFields;

    if (!data.name || !data.description || !data.region) {
        return { error: "Required fields are missing" };
    }

    const slug =
        data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Math.random().toString(36).substring(2, 7);

    const { error } = await supabase.from("companies").insert({
        owner_id: user.id,
        name: data.name,
        description: data.description,
        region: data.region,
        address: data.address,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        logo_url: data.logo_url,
        slug,
        status: "pending",
    });

    if (error) {
        console.error(error);
        return { error: "Failed to register company" };
    }

    revalidatePath("/owner/dashboard");
    return { success: true };
}

export async function updateRequestStatus(
    requestId: string,
    newStatus: RequestStatus,
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { data: currentRequest } = await supabase
        .from("dsar_requests")
        .select("status, company_id")
        .eq("id", requestId)
        .single();

    if (!currentRequest) return { error: "Request not found" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const { error } = await supabase
        .from("dsar_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

    if (error) {
        return { error: "Failed to update. You may not have permission." };
    }

    if (currentRequest.status !== newStatus) {
        await supabase.from("request_audit_logs").insert({
            request_id: requestId,
            changed_by: user.id,
            old_status: currentRequest.status,
            new_status: newStatus,
        });
    }

    revalidatePath("/owner/dashboard");
    revalidatePath("/admin");
    return { success: true };
}
