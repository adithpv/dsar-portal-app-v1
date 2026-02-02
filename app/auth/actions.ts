"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authSchema } from "@/schemas";
import { AuthState } from "@/types";

export async function login(
    prevState: AuthState,
    formData: FormData,
): Promise<AuthState> {
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const validatedFields = authSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Invalid email or password format." };
    }

    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return { error: error.message };
    }

    if (!user) {
        return { error: "Login failed" };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    revalidatePath("/", "layout");

    if (profile?.role === "admin") {
        redirect("/admin");
    } else {
        redirect("/owner/dashboard");
    }
}

export async function signup(
    prevState: AuthState,
    formData: FormData,
): Promise<AuthState> {
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const validatedFields = authSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Invalid input data." };
    }

    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.signUp(data);

    if (error) {
        return { error: error.message };
    }

    if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
            id: authData.user.id,
            email: data.email,
            role: "owner",
        });
    }

    revalidatePath("/", "layout");

    redirect("/owner/dashboard");
}
