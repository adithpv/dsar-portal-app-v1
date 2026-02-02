"use client";

import { useState } from "react";
import {
    MoreHorizontal,
    Loader2,
    Check,
    Clock,
    ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequestStatus } from "@/constants";
import { updateRequestStatus } from "../../actions";

export function RequestActionButtons({
    requestId,
    currentStatus,
}: {
    requestId: string;
    currentStatus: string;
}) {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (status: RequestStatus) => {
        setLoading(true);
        const result = await updateRequestStatus(requestId, status);
        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    {loading ?
                        <Loader2 className="h-4 w-4 animate-spin" />
                    :   <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>

                <DropdownMenuItem
                    onClick={() => handleUpdate("in_progress")}
                    disabled={currentStatus === "in_progress"}
                >
                    <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                    Mark In Progress
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => handleUpdate("in_review")}
                    disabled={currentStatus === "in_review"}
                >
                    <ShieldAlert className="mr-2 h-4 w-4 text-blue-600" />
                    Mark In Review
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => handleUpdate("closed")}
                    disabled={currentStatus === "closed"}
                >
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    Mark Closed
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
