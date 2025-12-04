"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Loader2, Filter } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*, workers(full_name)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-gray-100 text-gray-700';
            case 'accepted': return 'bg-blue-100 text-blue-700';
            case 'on_the_way': return 'bg-indigo-100 text-indigo-700';
            case 'working': return 'bg-yellow-100 text-yellow-700';
            case 'review': return 'bg-purple-100 text-purple-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <MobileContainer className="bg-slate-50 pb-20">
            <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-white px-4">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <span className="font-semibold">Semua Pesanan</span>
            </header>

            <main className="p-4">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bookings.map((booking) => (
                            <Card key={booking.id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-bold">{booking.service_category}</div>
                                        <div className="text-xs text-muted-foreground">ID: {booking.id.slice(0, 8)}</div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${getStatusColor(booking.status)}`}>
                                        {booking.status.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <div className="space-y-1 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span className="truncate">{booking.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{new Date(booking.scheduled_at).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-border">
                                    <div className="text-xs">
                                        Tukang: <span className="font-medium">{booking.workers?.full_name || '-'}</span>
                                    </div>
                                    <div className="font-bold text-primary">
                                        Rp {booking.total_price?.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {bookings.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                Belum ada pesanan.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </MobileContainer>
    );
}
