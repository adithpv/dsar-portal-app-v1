"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCheckoutSession } from "@/app/owner/stripe-actions";
import { Button } from "@/components/ui/button";

export function SubscribeButton({ companyId }: { companyId: string }) {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        const result = await createCheckoutSession(companyId);
        if (result?.error) {
            toast.error(result.error);
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white"
        >
            {loading ?
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            :   <CreditCard className="mr-2 h-4 w-4" />}
            Subscribe Now ($10/mo)
        </Button>
    );
}
