"use client";

import { useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveCompany, rejectCompany } from "../actions";

export function ApproveCompanyButton({ companyId }: { companyId: string }) {
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        await approveCompany(companyId);
        setLoading(false);
    };

    const handleReject = async () => {
        setLoading(true);
        await rejectCompany(companyId);
        setLoading(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                disabled={loading}
            >
                {loading ?
                    <Loader2 className="h-4 w-4 animate-spin" />
                :   <X className="h-4 w-4 mr-1" />}
                Reject
            </Button>

            <Button
                size="sm"
                onClick={handleApprove}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
            >
                {loading ?
                    <Loader2 className="h-4 w-4 animate-spin" />
                :   <Check className="h-4 w-4 mr-1" />}
                Approve
            </Button>
        </div>
    );
}
