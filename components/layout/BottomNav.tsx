"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Calendar, User } from 'lucide-react';
import { clsx } from 'clsx';

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/search', label: 'Cari', icon: Search },
        { href: '/orders', label: 'Pesanan', icon: Calendar },
        { href: '/profile', label: 'Akun', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white pb-safe">
            <div className="mx-auto flex h-16 max-w-[480px] items-center justify-around px-2">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "flex flex-col items-center justify-center space-y-1 px-3 py-2 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            <Icon className={clsx("h-6 w-6", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
