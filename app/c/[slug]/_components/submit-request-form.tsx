"use client";

import { useState } from "react";
import { submitRequest } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function SubmitRequestForm({ companyId }: { companyId: string }) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const result = await submitRequest(companyId, formData);

        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
            return;
        }

        if (result?.success) {
            toast.success("Request submitted successfully!");
            setSubmitted(true);
        }
    }

    if (submitted) {
        return (
            <div className="text-center p-6 bg-green-50 rounded-lg text-green-800 border border-green-200">
                <h3 className="font-bold text-lg mb-2">
                    Request Submitted Successfully
                </h3>
                <p>
                    The company's privacy team has been notified. They will
                    review your request and contact you shortly.
                </p>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" required placeholder="Jane Doe" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="jane@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+1 555 000 0000"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Request Type</Label>
                <Select name="request_type" required defaultValue="deletion">
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="deletion">
                            Delete My Data (Right to be Forgotten)
                        </SelectItem>
                        <SelectItem value="access">
                            Access My Data (DSAR)
                        </SelectItem>
                        <SelectItem value="correction">
                            Correct My Data
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="request_details">Request Details</Label>
                <Textarea
                    id="request_details"
                    name="request_details"
                    required
                    placeholder="Please describe specifically what data you are referring to..."
                    className="min-h-25"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="docs">Supporting Documents (Optional)</Label>
                <Input
                    id="docs"
                    type="file"
                    disabled
                    className="cursor-not-allowed opacity-50"
                />
                <p className="text-[10px] text-gray-500">
                    Uploads are disabled in this demo.
                </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit DSAR Request"}
            </Button>
        </form>
    );
}
