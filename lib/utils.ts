import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const statusStyles: Record<string, string> = {
    open: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    in_progress: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    closed: "bg-green-100 text-green-700 hover:bg-green-100",
};
