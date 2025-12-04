"use client";

import React, { useEffect, useState } from 'react';
import { Wallet, Star, Calendar, ChevronRight, Clock, MapPin, Loader2 } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function WorkerDashboard() {
    const router = useRouter();
    const [worker, setWorker] = useState<any>(null);
    const [activeJob, setActiveJob] = useState<any>(null);
    const [pendingJobs, setPendingJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWorkerData();
    }, []);

    const fetchWorkerData = async () => {
        try {
            // 1. Get Mock Worker (Simulating Auth)
            const { data: workers, error: workerError } = await supabase
                .from('workers')
                .select('*')
                .limit(1);

            if (workerError) throw workerError;
            const currentWorker = workers?.[0];
            setWorker(currentWorker);

            if (currentWorker) {
                // 2. Get Active Job (accepted, on_the_way, working)
                const { data: active, error: activeError } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('worker_id', currentWorker.id)
                    .in('status', ['accepted', 'on_the_way', 'working'])
                    .limit(1)
                    .single(); // Might be null if no active job

                if (!activeError && active) setActiveJob(active);

                // 3. Get Pending Requests
                const { data: pending, error: pendingError } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('worker_id', currentWorker.id)
                    .eq('status', 'pending');

                if (!pendingError && pending) setPendingJobs(pending);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptJob = async (jobId: string) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'accepted' })
                .eq('id', jobId);

            if (error) throw error;

            // Refresh data
            fetchWorkerData();
            alert('Pekerjaan diterima! Segera hubungi pelanggan.');
        } catch (error) {
            console.error('Error accepting job:', error);
            alert('Gagal menerima pekerjaan.');
        }
    };

    const handleRejectJob = async (jobId: string) => {
        if (!confirm('Apakah Anda yakin ingin menolak pekerjaan ini?')) return;
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'rejected' })
                .eq('id', jobId);

            if (error) throw error;

            // Refresh data
            fetchWorkerData();
        } catch (error) {
            console.error('Error rejecting job:', error);
        }
    };

    if (isLoading) {
        return (
            <MobileContainer className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </MobileContainer>
        );
    }

    return (
        <MobileContainer className="bg-muted/20 pb-20">
            {/* Header */}
            <header className="bg-primary text-white p-6 pb-12 rounded-b-[2rem] shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-xl font-bold">Halo, {worker?.full_name?.split(' ')[0] || 'Tukang'}</h1>
                            <div className="flex items-center gap-1 text-blue-200 text-sm">
                                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                Online - Siap Terima Order
                            </div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                            {worker?.full_name?.[0] || 'T'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <div className="text-blue-200 text-xs mb-1">Saldo Dompet</div>
                            <div className="text-xl font-bold flex items-center gap-2">
                                <Wallet className="h-4 w-4" />
                                Rp {worker?.balance?.toLocaleString('id-ID') || '0'}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <div className="text-blue-200 text-xs mb-1">Rating Saya</div>
                            <div className="text-xl font-bold flex items-center gap-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {worker?.rating || '5.0'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/5" />
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-white/5" />
            </header>

            <main className="p-4 -mt-6 relative z-20 space-y-6">
                {/* Active Job Card */}
                {activeJob && (
                    <section>
                        <div className="flex justify-between items-center mb-3 px-1">
                            <h3 className="font-bold text-lg">Pekerjaan Aktif</h3>
                        </div>
                        <Card className="border-l-4 border-l-secondary shadow-md">
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg">{activeJob.service_category}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{activeJob.location}</p>
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
                                        {activeJob.status.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <div className="flex gap-4 text-sm text-muted-foreground border-t border-border pt-3 mt-1">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {new Date(activeJob.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {activeJob.location.split(',')[0]}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Link href={`/worker/job/${activeJob.id}`} className="w-full">
                                        <Button className="w-full" size="sm">Update Status</Button>
                                    </Link>
                                    <Button variant="outline" size="sm" className="w-full">Navigasi</Button>
                                </div>
                            </div>
                        </Card>
                    </section>
                )}

                {/* Incoming Requests */}
                <section>
                    <div className="flex justify-between items-center mb-3 px-1">
                        <h3 className="font-bold text-lg">Permintaan Baru</h3>
                        {pendingJobs.length > 0 && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{pendingJobs.length}</span>
                        )}
                    </div>

                    <div className="space-y-3">
                        {pendingJobs.length > 0 ? (
                            pendingJobs.map((job) => (
                                <Card key={job.id} className="opacity-90">
                                    <div className="p-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold">{job.service_category}</span>
                                            <span className="text-secondary font-bold">Rp {job.total_price?.toLocaleString('id-ID') || '-'}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {job.location} • {new Date(job.scheduled_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button className="flex-1" size="sm" onClick={() => handleAcceptJob(job.id)}>Terima</Button>
                                            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => handleRejectJob(job.id)}>Tolak</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground bg-white/50 rounded-xl border border-dashed border-border">
                                <p>Belum ada permintaan baru</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Menu */}
                <section className="grid grid-cols-2 gap-3">
                    <Card className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer">
                        <Calendar className="h-8 w-8 text-primary" />
                        <span className="font-medium text-sm">Jadwal Saya</span>
                    </Card>
                    <Card className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer">
                        <Wallet className="h-8 w-8 text-primary" />
                        <span className="font-medium text-sm">Riwayat Saldo</span>
                    </Card>
                </section>
            </main>

            {/* Worker Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white pb-safe">
                <div className="mx-auto flex h-16 max-w-[480px] items-center justify-around px-2">
                    <div className="flex flex-col items-center justify-center space-y-1 px-3 py-2 text-primary">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-primary" />
                        </div>
                        <span className="text-[10px] font-medium">Home</span>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-1 px-3 py-2 text-muted-foreground">
                        <Calendar className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Jadwal</span>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-1 px-3 py-2 text-muted-foreground">
                        <Wallet className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Dompet</span>
                    </div>
                </div>
            </div>
        </MobileContainer>
    );
}
