"use client";

import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const ALL_CATEGORIES = [
    { id: 'ac', name: 'Service AC', icon: '❄️', color: 'bg-blue-100', count: 45 },
    { id: 'electric', name: 'Listrik', icon: '⚡', color: 'bg-yellow-100', count: 38 },
    { id: 'plumbing', name: 'Pipa Air', icon: '🚰', color: 'bg-cyan-100', count: 32 },
    { id: 'paint', name: 'Cat Dinding', icon: '🎨', color: 'bg-purple-100', count: 28 },
    { id: 'build', name: 'Renovasi', icon: '🔨', color: 'bg-orange-100', count: 52 },
    { id: 'clean', name: 'Cleaning', icon: '🧹', color: 'bg-green-100', count: 41 },
    { id: 'massage', name: 'Pijat', icon: '💆', color: 'bg-pink-100', count: 15 },
    { id: 'garden', name: 'Taman', icon: '🌱', color: 'bg-lime-100', count: 12 },
    { id: 'furniture', name: 'Furniture', icon: '🪑', color: 'bg-amber-100', count: 19 },
    { id: 'appliance', name: 'Elektronik', icon: '📱', color: 'bg-indigo-100', count: 23 },
    { id: 'car', name: 'Mobil', icon: '🚗', color: 'bg-red-100', count: 17 },
    { id: 'other', name: 'Lainnya', icon: '⋯', color: 'bg-gray-100', count: 8 },
];

export default function CategoriesPage() {
    return (
        <MobileContainer className="pb-24">
            <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-white/80 px-4 backdrop-blur-md">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <span className="font-semibold ml-2">Semua Kategori</span>
            </header>

            <main className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    {ALL_CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/search?category=${cat.id}`}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-border hover:shadow-md transition-all active:scale-95"
                        >
                            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl ${cat.color}`}>
                                {cat.icon}
                            </div>
                            <span className="text-sm font-medium text-center leading-tight">{cat.name}</span>
                            <span className="text-xs text-muted-foreground">{cat.count} tukang</span>
                        </Link>
                    ))}
                </div>
            </main>
        </MobileContainer>
    );
}
