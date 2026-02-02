import { createClient as createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SubmitRequestForm } from "./_components/submit-request-form";

export default async function PublicCompanyPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createServerClient();
    const { data: company } = await supabase
        .from("companies")
        .select("id, name, description, region, logo_url, subscription_status")
        .eq("slug", slug)
        .eq("status", "approved")
        .single();

    if (!company) return notFound();

    if (company.subscription_status !== "active") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Portal Suspended 🔒
                </h1>
                <p className="text-gray-600 max-w-md">
                    This company's privacy portal is currently inactive because
                    they have not subscribed.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="text-center">
                    {company.logo_url && (
                        <div className="flex justify-center mb-4">
                            <img
                                src={company.logo_url}
                                alt={company.name}
                                className="h-20 w-auto object-contain"
                            />
                        </div>
                    )}

                    <CardTitle className="text-2xl font-bold">
                        {company.name}
                    </CardTitle>
                    <CardDescription>
                        Privacy Request Portal ({company.region})
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-600 mb-6 text-sm">
                        {company.description}
                    </p>
                    <SubmitRequestForm companyId={company.id} />
                </CardContent>
            </Card>
            <div className="mt-8 text-xs text-gray-400">
                Powered by DSAR Portal
            </div>
        </div>
    );
}
