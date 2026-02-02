"use client";

import clsx from "clsx";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { RequestActionButtons } from "@/app/owner/dashboard/_components/request-buttons";
import { AdminRequest } from "@/types";
import { statusStyles } from "@/lib/utils";

export const columns: ColumnDef<AdminRequest>[] = [
    {
        accessorKey: "companies.name",
        header: "Company",
        cell: ({ row }) => (
            <span className="font-semibold">
                {row.original.companies?.name || "Unknown"}
            </span>
        ),
    },
    {
        accessorKey: "requester_name",
        header: "Requester",
    },
    {
        accessorKey: "requester_email",
        header: "Email",
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) =>
            new Date(row.getValue("created_at")).toLocaleDateString(),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    variant="secondary"
                    className={clsx(
                        statusStyles[status] ?? "bg-slate-100 text-slate-700",
                    )}
                >
                    {status.replace("_", " ").toUpperCase()}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <RequestActionButtons
                    requestId={row.original.id}
                    currentStatus={row.original.status}
                />
            );
        },
    },
];
