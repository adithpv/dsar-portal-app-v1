"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { CompanyRequest } from "@/types";
import { statusStyles } from "@/lib/utils";
import { RequestActionButtons } from "./request-buttons";

export const columns: ColumnDef<CompanyRequest>[] = [
    {
        accessorKey: "requester_name",
        header: "Requester",
    },
    {
        accessorKey: "requester_email",
        header: "Contact Info",
        cell: ({ row }) => {
            const email = row.getValue("requester_email") as string;
            const phone = row.original.requester_phone;
            return (
                <div className="flex flex-col">
                    <span>{email}</span>
                    {phone && (
                        <span className="text-xs text-gray-400">{phone}</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => {
            return new Date(row.getValue("created_at")).toLocaleDateString();
        },
    },
    {
        accessorKey: "request_type",
        header: "Type",
        cell: ({ row }) => {
            const type = (row.getValue("request_type") as string) || "General";
            return (
                <Badge
                    variant={type === "deletion" ? "destructive" : "outline"}
                >
                    {type}
                </Badge>
            );
        },
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
        header: "Actions",
        cell: ({ row }) => {
            const request = row.original;
            return (
                <RequestActionButtons
                    requestId={request.id}
                    currentStatus={request.status}
                />
            );
        },
    },
];
