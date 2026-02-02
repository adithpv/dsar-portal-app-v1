import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { columns } from "./_components/global-requests-columns";
import { ApproveCompanyButton } from "./_components/approve-company-button";
import { logColumns } from "./_components/log-columns";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") redirect("/owner/dashboard");

    const { data: pendingCompanies } = await supabase
        .from("companies")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    const { data: allRequests } = await supabase
        .from("dsar_requests")
        .select("*, companies(name)")
        .order("created_at", { ascending: false });

    const { data: auditLogs } = await supabase
        .from("request_audit_logs")
        .select("*, dsar_requests(requester_email), profiles(role, email)")
        .order("changed_at", { ascending: false });

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    Admin Console
                </h1>
                <Badge variant="outline">Administrator</Badge>
            </div>

            <Tabs defaultValue="companies" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-100">
                    <TabsTrigger value="companies">
                        Pending Companies
                    </TabsTrigger>
                    <TabsTrigger value="requests">All Requests</TabsTrigger>
                    <TabsTrigger value="logs">Audit Logs</TabsTrigger>
                </TabsList>

                {/* TAB 1: COMPANIES */}
                <TabsContent value="companies" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Approvals</CardTitle>
                            <CardDescription>
                                Companies waiting for your review.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {(
                                !pendingCompanies ||
                                pendingCompanies.length === 0
                            ) ?
                                <p className="text-muted-foreground">
                                    No pending companies.
                                </p>
                            :   <div className="space-y-4">
                                    {pendingCompanies.map((company) => (
                                        <div
                                            key={company.id}
                                            className="flex items-center justify-between border p-4 rounded-lg bg-white shadow-sm"
                                        >
                                            <div>
                                                <h3 className="font-bold text-lg">
                                                    {company.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {company.description}
                                                </p>
                                                <div className="flex gap-2 mt-2 text-xs text-gray-400">
                                                    <span>
                                                        {company.region}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {company.employees_count ||
                                                            0}{" "}
                                                        employees
                                                    </span>
                                                </div>
                                            </div>
                                            <ApproveCompanyButton
                                                companyId={company.id}
                                            />
                                        </div>
                                    ))}
                                </div>
                            }
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: REQUESTS */}
                <TabsContent value="requests" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Global Request Log</CardTitle>
                            <CardDescription>
                                View and manage DSAR requests across all
                                companies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={allRequests || []}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: LOGS */}
                <TabsContent value="logs" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Audit Trails</CardTitle>
                            <CardDescription>
                                Immutable record of all status changes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={logColumns}
                                data={auditLogs || []}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
