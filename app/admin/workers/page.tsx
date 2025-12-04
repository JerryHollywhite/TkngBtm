"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Shield, Search, Loader2 } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function AdminWorkersPage() {
    const [workers, setWorkers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
            const { data, error } = await supabase
                .from('workers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWorkers(data || []);
        } catch (error) {
            console.error('Error fetching workers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVerification = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('workers')
                .update({ is_verified: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update
            setWorkers(workers.map(w => w.id === id ? { ...w, is_verified: !currentStatus } : w));
        } catch (error) {
            console.error('Error updating verification:', error);
            alert('Gagal update status verifikasi');
        }
    };

    const filteredWorkers = workers.filter(worker => {
        const matchesSearch = worker.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            worker.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all'
            ? true
            : filter === 'verified' ? worker.is_verified : !worker.is_verified;

        return matchesSearch && matchesFilter;
    });

    return (
        <MobileContainer className="bg-slate-50 pb-20">
            <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-white px-4">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <span className="font-semibold">Kelola Tukang</span>
            </header>

            <main className="p-4 space-y-4">
                {/* Search & Filter */}
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau kategori..."
                            className="pl-9 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <Button
                            size="sm"
                            variant={filter === 'all' ? 'primary' : 'outline'}
                            onClick={() => setFilter('all')}
                        >
                            Semua
                        </Button>
                        <Button
                            size="sm"
                            variant={filter === 'unverified' ? 'primary' : 'outline'}
                            onClick={() => setFilter('unverified')}
                            className={filter === 'unverified' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                        >
                            Perlu Verifikasi
                        </Button>
                        <Button
                            size="sm"
                            variant={filter === 'verified' ? 'primary' : 'outline'}
                            onClick={() => setFilter('verified')}
                            className={filter === 'verified' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            Terverifikasi
                        </Button>
                    </div>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredWorkers.map((worker) => (
                            <Card key={worker.id} className="overflow-hidden">
                                <div className="p-4 flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                                        <img
                                            src={worker.image_url || 'https://via.placeholder.com/100'}
                                            alt={worker.full_name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold truncate">{worker.full_name}</h4>
                                                <p className="text-sm text-muted-foreground">{worker.category}</p>
                                            </div>
                                            {worker.is_verified && (
                                                <Shield className="h-4 w-4 text-green-600 fill-green-100" />
                                            )}
                                        </div>

                                        <div className="mt-3 flex gap-2">
                                            <Button
                                                size="sm"
                                                variant={worker.is_verified ? "outline" : "primary"}
                                                className={`flex-1 ${!worker.is_verified ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                                onClick={() => toggleVerification(worker.id, worker.is_verified)}
                                            >
                                                {worker.is_verified ? 'Batalkan Verifikasi' : 'Verifikasi Sekarang'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {filteredWorkers.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                Tidak ada data tukang.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </MobileContainer>
    );
}
