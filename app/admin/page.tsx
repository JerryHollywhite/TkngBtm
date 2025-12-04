"use client";

import React, { useEffect, useState } from 'react';
import { Users, ShoppingBag, AlertCircle, TrendingUp, Shield, Activity, Loader2 } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        activeWorkers: 0,
        totalWorkers: 0,
        pendingVerifications: 0,
        recentActivity: [] as any[]
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // 1. Workers Stats
            const { data: workers } = await supabase.from('workers').select('id, is_verified');
            const totalWorkers = workers?.length || 0;
            const activeWorkers = workers?.filter(w => w.is_verified).length || 0;
            const pendingVerifications = workers?.filter(w => !w.is_verified).length || 0;

            // 2. Bookings/Revenue Stats
            const { data: bookings } = await supabase
                .from('bookings')
                .select('total_price, created_at, status, service_category')
                .order('created_at', { ascending: false })
                .limit(5);

            const totalRevenue = 45200000; // Mock total for now as we don't sum all rows

            setStats({
                totalRevenue,
                activeWorkers,
                totalWorkers,
                pendingVerifications,
                recentActivity: bookings || []
            });
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MobileContainer className="bg-slate-50">
            <header className="bg-slate-900 text-white p-6 pb-12">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                        ADM
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400 text-xs mb-1">Total Transaksi</div>
                        <div className="text-xl font-bold text-emerald-400">Rp 45.2Jt</div>
                        <div className="text-[10px] text-emerald-500 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +12% bulan ini
                        </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl">
                        <div className="text-slate-400 text-xs mb-1">Tukang Aktif</div>
                        <div className="text-xl font-bold text-blue-400">{stats.activeWorkers}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                            dari {stats.totalWorkers} terdaftar
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-4 -mt-8 space-y-6">
                {/* Action Required */}
                <section>
                    <h3 className="font-bold text-slate-900 mb-3 px-1">Perlu Tindakan</h3>
                    <div className="space-y-3">
                        {stats.pendingVerifications > 0 ? (
                            <Card className="border-l-4 border-l-orange-500">
                                <div className="p-4 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-sm">Verifikasi Tukang Baru</div>
                                        <div className="text-xs text-muted-foreground">{stats.pendingVerifications} pengajuan menunggu</div>
                                    </div>
                                    <Link href="/admin/workers">
                                        <Button size="sm" variant="outline">Review</Button>
                                    </Link>
                                </div>
                            </Card>
                        ) : (
                            <div className="text-sm text-muted-foreground px-1">Tidak ada tindakan mendesak.</div>
                        )}
                    </div>
                </section>

                {/* Live Activity */}
                <section>
                    <h3 className="font-bold text-slate-900 mb-3 px-1">Aktivitas Terbaru</h3>
                    <Card>
                        <div className="divide-y divide-border">
                            {stats.recentActivity.map((item, i) => (
                                <div key={i} className="p-3 flex gap-3 items-start">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-600`}>
                                        <ShoppingBag className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            Order baru: {item.service_category}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(item.created_at).toLocaleTimeString('id-ID')} • {item.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {stats.recentActivity.length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground">Belum ada aktivitas.</div>
                            )}
                        </div>
                    </Card>
                </section>

                {/* Quick Links */}
                <section className="grid grid-cols-3 gap-3">
                    <Link href="/admin/workers" className="contents">
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white">
                            <Users className="h-6 w-6 text-slate-700" />
                            <span className="text-[10px]">Tukang</span>
                        </Button>
                    </Link>
                    <Link href="/admin/bookings" className="contents">
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white">
                            <ShoppingBag className="h-6 w-6 text-slate-700" />
                            <span className="text-[10px]">Pesanan</span>
                        </Button>
                    </Link>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-white">
                        <Activity className="h-6 w-6 text-slate-700" />
                        <span className="text-[10px]">Laporan</span>
                    </Button>
                </section>
            </main>
        </MobileContainer>
    );
}
