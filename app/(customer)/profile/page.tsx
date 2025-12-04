"use client";

import React, { useEffect, useState } from 'react';
import { User, Settings, LogOut, CreditCard, Bell, HelpCircle, ChevronRight } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsLoading(false);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <MobileContainer>
            <div className="bg-[#2F80ED] p-6 pt-12 text-white">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">
                            {user ? (user.user_metadata?.full_name || 'Pengguna') : 'Halo, Tamu'}
                        </h1>
                        <p className="text-white text-sm">
                            {user ? user.email : 'Masuk untuk akses fitur lengkap'}
                        </p>
                    </div>
                </div>

                {!user && !isLoading && (
                    <Link href="/login">
                        <Button variant="secondary" className="w-full font-bold bg-white text-primary hover:bg-white/90">
                            Masuk / Daftar
                        </Button>
                    </Link>
                )}
            </div>

            <main className="flex-1 p-4 space-y-4 -mt-4">
                <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                    {[
                        { icon: CreditCard, label: 'Riwayat Pesanan', href: '/orders' },
                        { icon: Bell, label: 'Notifikasi', href: '/notifications' },
                        { icon: Settings, label: 'Pengaturan', href: '/settings' },
                        { icon: HelpCircle, label: 'Bantuan & Support', href: '#' },
                    ].map((item, i) => (
                        <Link key={i} href={item.href} className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors border-b border-border last:border-0">
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                    ))}
                </div>

                {user && (
                    <Button
                        variant="ghost"
                        className="w-full text-error hover:text-error hover:bg-error/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Keluar
                    </Button>
                )}
            </main>

            <BottomNav />
        </MobileContainer>
    );
}
