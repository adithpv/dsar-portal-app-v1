import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import clsx from "clsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { RegisterCompanyForm } from "./_components/register-form";
import { SubscribeButton } from "./_components/subscribe-button";
import { columns } from "./_components/company-requests-columns";

export default async function OwnerDashboard() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login");

    const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

    if (!company) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Register Your Company</CardTitle>
                        <CardDescription>
                            Complete your profile to start receiving DSAR
                            requests.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RegisterCompanyForm />
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { data: requests } = await supabase
        .from("dsar_requests")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

    const isPro = company.subscription_status === "active";

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    Owner Dashboard
                </h1>

                <div className="flex items-center gap-3">
                    <Badge
                        variant="outline"
                        className={clsx(
                            "px-3 py-1",
                            isPro ?
                                "border-green-200 text-green-700 bg-green-50"
                            :   "border-slate-200 text-slate-500 bg-slate-50",
                        )}
                    >
                        Plan: {isPro ? "PRO" : "FREE (Inactive)"}
                    </Badge>
                    {!isPro && <SubscribeButton companyId={company.id} />}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">
                                {company.name}
                            </CardTitle>
                            <CardDescription className="text-base mt-1">
                                {company.description}
                            </CardDescription>
                        </div>
                        {company.logo_url && (
                            <img
                                src={company.logo_url}
                                alt="Logo"
                                className="h-16 w-16 rounded-full object-cover border"
                            />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500 mb-1">
                                Public Portal
                            </h3>
                            <div className="flex items-center gap-2">
                                {company.slug ?
                                    <Link
                                        href={`/c/${company.slug}`}
                                        target="_blank"
                                        className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
                                    >
                                        <code className="bg-slate-100 px-2 py-1 rounded text-sm text-blue-600 font-semibold group-hover:bg-blue-50">
                                            /c/{company.slug}
                                        </code>
                                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                                    </Link>
                                :   <code className="bg-slate-100 px-2 py-1 rounded text-sm text-gray-500">
                                        Pending Approval
                                    </code>
                                }

                                {company.slug && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs border-green-200 text-green-700 bg-green-50"
                                    >
                                        Live
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-500 mb-1">
                                Region
                            </h3>
                            <Badge variant="secondary">{company.region}</Badge>
                        </div>
                    </div>
                    <div className="space-y-3 border-l pl-6">
                        <h3 className="font-semibold text-sm text-gray-900">
                            Contact Information
                        </h3>

                        <div className="text-sm">
                            <span className="text-gray-500 block text-xs">
                                Email
                            </span>
                            <span>{company.contact_email || "N/A"}</span>
                        </div>

                        <div className="text-sm">
                            <span className="text-gray-500 block text-xs">
                                Phone
                            </span>
                            <span>{company.contact_phone || "N/A"}</span>
                        </div>

                        <div className="text-sm">
                            <span className="text-gray-500 block text-xs">
                                Headquarters
                            </span>
                            <span className="whitespace-pre-wrap">
                                {company.address || "N/A"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>DSAR Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={requests || []} />
                </CardContent>
            </Card>
        </div>
    );
}
