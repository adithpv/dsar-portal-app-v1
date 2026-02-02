"use client";

import { useState } from "react";
import clsx from "clsx";
import { toast } from "sonner";
import { Loader2, UploadCloud, FileCheck } from "lucide-react";
import { registerCompany } from "../../actions";
import { createClient } from "@/lib/supabase/client";
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
import { uploadLogoAndAttach } from "@/lib/upload-logo";

export function RegisterCompanyForm() {
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const supabase = createClient();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const file = formData.get("logo") as File;

        try {
            await uploadLogoAndAttach(formData, supabase);

            const result = await registerCompany(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Company registered successfully!");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" name="name" required placeholder="Acme Corp" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div
                    className={clsx(
                        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition cursor-pointer relative",
                        fileName ?
                            "border-green-500 bg-green-50"
                        :   "border-slate-200 hover:bg-slate-50",
                    )}
                >
                    {fileName ?
                        <div className="text-center text-green-700">
                            <FileCheck className="h-8 w-8 mb-2 mx-auto" />
                            <span className="text-sm font-medium">
                                {fileName}
                            </span>
                            <p className="text-xs opacity-70 mt-1">
                                Click to change file
                            </p>
                        </div>
                    :   <div className="text-center text-slate-500">
                            <UploadCloud className="h-8 w-8 mb-2 mx-auto" />
                            <span className="text-xs">
                                Click to upload (PNG/JPG)
                            </span>
                        </div>
                    }

                    <Input
                        id="logo"
                        name="logo"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setFileName(e.target.files[0].name);
                            }
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        required
                        placeholder="privacy@acme.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                        id="contact_phone"
                        name="contact_phone"
                        type="tel"
                        placeholder="+1 234 567 890"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Headquarters Address</Label>
                <Textarea
                    id="address"
                    name="address"
                    required
                    placeholder="123 Privacy St, Tech City..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Field of Work / Service</Label>
                <Input
                    id="description"
                    name="description"
                    required
                    placeholder="e.g. Software, Healthcare, Finance"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="region">Representation Region</Label>
                <Select name="region" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="EU">EU (European Union)</SelectItem>
                        <SelectItem value="UK">UK (United Kingdom)</SelectItem>
                        <SelectItem value="EU_UK">Both (EU & UK)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ?
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                :   "Register Company"}
            </Button>
        </form>
    );
}
