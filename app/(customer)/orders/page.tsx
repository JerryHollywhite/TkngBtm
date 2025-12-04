"use client";

import React from 'react';
import { ArrowLeft, Clock, MapPin, Star, ChevronRight } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Image from 'next/image';

// Mock orders data
const ORDERS = [
    {
        id: '1',
        worker_name: 'Budi Santoso',
        worker_image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400',
        service: 'Service AC',
        status: 'working',
        status_label: 'Sedang Dikerjakan',
        status_color: 'bg-blue-500',
        scheduled_at: '03 Des 2024, 14:00',
        location: 'Jl. Sudirman No. 123, Batam Center',
        total: 'Rp 150.000',
    },
    {
        id: '2',
        worker_name: 'Ahmad Dani',
        worker_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        service: 'Instalasi Listrik',
        status: 'done',
        status_label: 'Selesai',
        status_color: 'bg-green-500',
        scheduled_at: '01 Des 2024, 10:00',
        location: 'Jl. Ahmad Yani No. 45, Nagoya',
        total: 'Rp 200.000',
    },
    {
        id: '3',
        worker_name: 'Siti Aminah',
        worker_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        service: 'Cleaning Rumah',
        status: 'cancelled',
        status_label: 'Dibatalkan',
        status_color: 'bg-red-500',
        scheduled_at: '28 Nov 2024, 09:00',
        location: 'Komplek Permata, Sekupang',
        total: 'Rp 80.000',
    },
];

export default function OrdersPage() {
    return (
        <MobileContainer className="bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white px-4">
                <Link href="/profile">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <span className="font-semibold">Pesanan Saya</span>
                <div className="w-10" /> {/* Spacer for alignment */}
            </header>

            <main className="flex-1 p-4 space-y-3 pb-24">
                {ORDERS.length > 0 ? (
                    ORDERS.map((order) => (
                        <Link key={order.id} href={`/orders/${order.id}`}>
                            <Card className="overflow-hidden active:scale-[0.98] transition-transform">
                                <div className="p-4 space-y-3">
                                    {/* Worker Info */}
                                    <div className="flex gap-3">
                                        <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                            <Image
                                                src={order.worker_image}
                                                alt={order.worker_name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-primary">{order.worker_name}</h3>
                                                    <p className="text-sm text-muted-foreground">{order.service}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full text-white ${order.status_color}`}>
                                                    {order.status_label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span>{order.scheduled_at}</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span>{order.location}</span>
                                        </div>
                                    </div>

                                    {/* Total & Action */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border">
                                        <div>
                                            <span className="text-xs text-muted-foreground">Total Biaya</span>
                                            <p className="font-bold text-secondary">{order.total}</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Clock className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Belum Ada Pesanan</h3>
                        <p className="text-muted-foreground mb-6">
                            Anda belum memiliki riwayat pesanan.
                        </p>
                        <Link href="/">
                            <Button>Cari Tukang</Button>
                        </Link>
                    </div>
                )}
            </main>
        </MobileContainer>
    );
}
