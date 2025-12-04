"use client";

import React from 'react';
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

const NOTIFICATIONS = [
    {
        id: 1,
        type: 'success',
        icon: CheckCircle,
        title: 'Pesanan Selesai',
        message: 'Pak Budi telah menyelesaikan pekerjaan "Service AC"',
        time: '2 jam lalu',
        read: false,
    },
    {
        id: 2,
        type: 'info',
        icon: Bell,
        title: 'Tukang Sedang Menuju Lokasi',
        message: 'Kang Asep dalam perjalanan ke lokasi Anda',
        time: '5 jam lalu',
        read: false,
    },
    {
        id: 3,
        type: 'info',
        icon: Info,
        title: 'Promo Spesial!',
        message: 'Diskon 20% untuk jasa cleaning hari ini',
        time: '1 hari lalu',
        read: true,
    },
    {
        id: 4,
        type: 'warning',
        icon: AlertCircle,
        title: 'Pembayaran Tertunda',
        message: 'Silakan selesaikan pembayaran untuk pesanan #1234',
        time: '2 hari lalu',
        read: true,
    },
];

export default function NotificationsPage() {
    const iconColors = {
        success: 'text-green-600 bg-green-50',
        info: 'text-blue-600 bg-blue-50',
        warning: 'text-orange-600 bg-orange-50',
    };

    return (
        <MobileContainer className="pb-24">
            <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-white/80 px-4 backdrop-blur-md">
                <Link href="/profile">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <span className="font-semibold ml-2">Notifikasi</span>
            </header>

            <main className="p-4 space-y-3">
                {NOTIFICATIONS.length > 0 ? (
                    NOTIFICATIONS.map((notif) => (
                        <Card
                            key={notif.id}
                            className={`p-4 ${!notif.read ? 'border-l-4 border-l-primary bg-blue-50/30' : ''}`}
                        >
                            <div className="flex gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[notif.type as keyof typeof iconColors]}`}>
                                    <notif.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm">{notif.title}</h4>
                                        {!notif.read && (
                                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-snug mb-2">
                                        {notif.message}
                                    </p>
                                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-16">
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Bell className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Tidak Ada Notifikasi</h3>
                        <p className="text-muted-foreground">
                            Notifikasi Anda akan muncul di sini
                        </p>
                    </div>
                )}
            </main>
        </MobileContainer>
    );
}
