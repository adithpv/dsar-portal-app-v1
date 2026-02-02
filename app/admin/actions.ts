"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function approveCompany(companyId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { error: "Unauthorized: Admins only" };
    }

    const { data: company } = await supabase
        .from("companies")
        .select("name")
        .eq("id", companyId)
        .single();

    if (!company) return { error: "Company not found" };

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const baseSlug = company.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uniqueSlug = `${baseSlug}-${randomSuffix}`;
    const { error } = await supabase
        .from("companies")
        .update({
            status: "approved",
            slug: uniqueSlug,
        })
        .eq("id", companyId);

    if (error) {
        return { error: "Failed to approve company" };
    }

    revalidatePath("/admin");
    return { success: true };
}

export async function rejectCompany(companyId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

    if (profile?.role !== "admin") return { error: "Unauthorized" };

    const { error } = await supabase
        .from("companies")
        .update({ status: "rejected" })
        .eq("id", companyId);

    if (error) return { error: "Failed to reject" };

    revalidatePath("/admin");
    return { success: true };
}
