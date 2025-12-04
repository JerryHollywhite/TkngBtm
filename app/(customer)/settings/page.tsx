"use client";

import React from 'react';
import { ArrowLeft, Bell, Globe, Moon, Lock, HelpCircle, Info, ChevronRight } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const SETTINGS_SECTIONS = [
    {
        title: 'Preferensi',
        items: [
            { icon: Bell, label: 'Notifikasi', value: 'Aktif', href: '/notifications' },
            { icon: Globe, label: 'Bahasa', value: 'Indonesia', href: '#' },
            { icon: Moon, label: 'Mode Gelap', value: 'Mati', href: '#' },
        ],
    },
    {
        title: 'Keamanan',
        items: [
            { icon: Lock, label: 'Ubah Password', value: '', href: '#' },
            { icon: Lock, label: 'Verifikasi 2 Langkah', value: 'Belum Aktif', href: '#' },
        ],
    },
    {
        title: 'Bantuan',
        items: [
            { icon: HelpCircle, label: 'Pusat Bantuan', value: '', href: '#' },
            { icon: Info, label: 'Tentang Aplikasi', value: 'v1.0.0', href: '#' },
        ],
    },
];

export default function SettingsPage() {
    return (
        <MobileContainer className="pb-24">
            <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-white/80 px-4 backdrop-blur-md">
                <Link href="/profile">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <span className="font-semibold ml-2">Pengaturan</span>
            </header>

            <main className="p-4 space-y-6">
                {SETTINGS_SECTIONS.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground px-2">{section.title}</h3>
                        <div className="bg-white rounded-2xl border border-border overflow-hidden">
                            {section.items.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className="flex items-center justify-between p-4 hover:bg-muted transition-colors border-b border-border last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.value && (
                                            <span className="text-sm text-muted-foreground">{item.value}</span>
                                        )}
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </main>
        </MobileContainer>
    );
}
