import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SubscriptionSuccess({
    searchParams,
}: {
    searchParams: Promise<{ session_id: string }>;
}) {
    const { session_id } = await searchParams;

    if (!session_id) redirect("/owner/dashboard");

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
            <Card className="w-full max-w-md text-center shadow-lg border-green-200">
                <CardHeader>
                    <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl text-green-700">
                        Payment Successful!
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600">
                        Your subscription is being activated. <br />
                        Your Privacy Portal is now <strong>Online</strong>.
                    </p>
                    <Link href="/owner/dashboard">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                            Return to Dashboard
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
