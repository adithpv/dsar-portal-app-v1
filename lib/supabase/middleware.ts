import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isProtectedRoute =
        path.startsWith("/owner") || path.startsWith("/admin");

    // --- RULE 1: GUEST TRYING TO ACCESS PROTECTED ROUTE ---
    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    // --- RULE 2: LOGGED IN USER TRYING TO ACCESS AUTH PAGE ---
    if (user && path.startsWith("/auth")) {
        const url = request.nextUrl.clone();
        url.pathname = "/owner/dashboard";
        return NextResponse.redirect(url);
    }

    // --- RULE 3: ROLE-BASED ACCESS CONTROL (RBAC) ---
    if (user && isProtectedRoute) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        const userRole = profile?.role || "owner";

        if (path.startsWith("/admin") && userRole !== "admin") {
            return NextResponse.redirect(
                new URL("/owner/dashboard", request.url),
            );
        }

        if (path.startsWith("/owner") && userRole === "admin") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }

    return supabaseResponse;
}
