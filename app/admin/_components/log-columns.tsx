"use client";

import clsx from "clsx";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AuditLog } from "@/types";
import { statusStyles } from "@/lib/utils";

export const logColumns: ColumnDef<AuditLog>[] = [
    {
        accessorKey: "changed_at",
        header: "Time",
        cell: ({ row }) => {
            const dateVal =
                (row.getValue("changed_at") as string) ||
                new Date().toISOString();
            return new Date(dateVal).toLocaleString();
        },
    },
    {
        id: "requester_email",
        accessorKey: "dsar_requests.requester_email",
        header: "Request Email",
        cell: ({ row }) =>
            row.original.dsar_requests?.requester_email || "Unknown",
    },
    {
        id: "change",
        header: "Change",
        cell: ({ row }) => {
            const oldStatus = row.original.old_status;
            const newStatus = row.original.new_status;
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-gray-500">
                        {oldStatus.replace("_", " ").toUpperCase()}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <Badge
                        variant="secondary"
                        className={clsx(
                            statusStyles[newStatus] ?? statusStyles.open,
                        )}
                    >
                        {newStatus.replace("_", " ").toUpperCase()}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "profiles.role",
        header: "Changed By",
        cell: ({ row }) => {
            const role = row.original.profiles?.role || "System";
            const email = row.original.profiles?.email || "User";

            return (
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{email}</span>
                    <span className="text-xs text-gray-400 uppercase">
                        {role}
                    </span>
                </div>
            );
        },
    },
];
