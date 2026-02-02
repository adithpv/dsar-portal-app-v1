import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Terminal } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-pink-100">
            <header className="px-8 h-20 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-slate-900 text-white flex items-center justify-center rounded-lg">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <span className="font-semibold tracking-tight text-lg">
                        DSAR Portal
                    </span>
                </div>
                <nav className="flex items-center gap-6">
                    <Link
                        href="/auth/login"
                        className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        Sign in
                    </Link>
                    <Link href="/auth/signup">
                        <Button
                            size="sm"
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6"
                        >
                            Register
                        </Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-32">
                <div className="mb-8 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium uppercase tracking-wider">
                    <Terminal className="h-3 w-3" />
                    <span>Machine Test Submission</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 max-w-4xl mx-auto leading-[1.1]">
                    Privacy Request <br className="hidden sm:inline" />
                    Management System
                </h1>

                <p className="mx-auto max-w-xl text-slate-500 md:text-lg leading-relaxed mt-6 font-light">
                    A full-stack implementation of a DSAR workflow. Built with
                    Next.js 16, Supabase, and Stripe integration.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full justify-center">
                    <Link href="/auth/signup">
                        <Button
                            size="lg"
                            className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white w-full sm:w-auto rounded-full text-base"
                        >
                            Register Company
                        </Button>
                    </Link>
                    <Link href="/auth/login">
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-12 px-8 border-slate-200 hover:bg-slate-50 hover:text-slate-900 w-full sm:w-auto rounded-full text-base"
                        >
                            Admin Console
                        </Button>
                    </Link>
                </div>
            </main>

            <footer className="py-8 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
                    <p>© 2026 DSAR Portal. All rights reserved.</p>

                    {/* PULSING PINK BADGE */}
                    <Badge
                        variant="outline"
                        className="border-pink-200 text-pink-700 bg-pink-50 gap-2 pr-4 font-normal"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                        </span>
                        Development Project
                    </Badge>
                </div>
            </footer>
        </div>
    );
}
