import React from 'react';
import { Bell, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function Header() {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur-sm shadow-sm">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Wrench className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-primary leading-tight">TukangBatam</h1>
                    <p className="text-[10px] text-muted-foreground leading-none">Solusi Rumahmu</p>
                </div>
            </Link>
            <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            </Button>
        </header>
    );
}
