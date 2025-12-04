"use client";

import React, { useEffect, useState, use } from 'react';
import { ArrowLeft, Star, MapPin, ShieldCheck, Clock, Share2, MessageCircle, Loader2 } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/Skeleton';

export default function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [worker, setWorker] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchWorker() {
            try {
                const { data, error } = await supabase
                    .from('workers')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setWorker(data);
            } catch (error) {
                console.error('Error fetching worker:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchWorker();
    }, [id]);

    if (isLoading) {
        return (
            <MobileContainer className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </MobileContainer>
        );
    }

    if (!worker) {
        return (
            <MobileContainer className="flex flex-col items-center justify-center h-screen p-4 text-center">
                <h2 className="text-lg font-bold">Tukang Tidak Ditemukan</h2>
                <p className="text-muted-foreground mb-4">Maaf, data tukang yang Anda cari tidak tersedia.</p>
                <Link href="/">
                    <Button>Kembali ke Beranda</Button>
                </Link>
            </MobileContainer>
        );
    }

    return (
        <MobileContainer className="pb-24">
            {/* Custom Header for Profile */}
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur-md">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <span className="font-semibold">Profil Tukang</span>
                <Button variant="ghost" size="icon" className="-mr-2">
                    <Share2 className="h-5 w-5" />
                </Button>
            </header>

            <main className="animate-in fade-in slide-in-from-bottom-4">
                {/* Hero Profile */}
                <div className="bg-white p-4 pb-6 border-b border-border">
                    <div className="flex gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                            <Image
                                src={worker.image_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'}
                                alt={worker.full_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-primary leading-tight mb-1">{worker.full_name}</h1>
                            <p className="text-sm text-muted-foreground mb-2">{worker.category}</p>

                            <div className="flex flex-wrap gap-2 text-xs">
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-700 font-medium">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {worker.rating} ({worker.jobs_completed} jobs)
                                </div>
                                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg text-blue-700 font-medium">
                                    <ShieldCheck className="h-3 w-3" />
                                    Terverifikasi
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                        <div className="space-y-1">
                            <div className="text-lg font-bold text-primary">{worker.jobs_completed}+</div>
                            <div className="text-xs text-muted-foreground">Pekerjaan</div>
                        </div>
                        <div className="space-y-1 border-l border-r border-border">
                            <div className="text-lg font-bold text-primary">5 Thn</div>
                            <div className="text-xs text-muted-foreground">Pengalaman</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-lg font-bold text-secondary">98%</div>
                            <div className="text-xs text-muted-foreground">Puas</div>
                        </div>
                    </div>
                </div>

                {/* About & Skills */}
                <div className="p-4 space-y-4 bg-white mt-2 border-y border-border">
                    <section>
                        <h3 className="font-semibold mb-2">Tentang</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {worker.bio || 'Tidak ada deskripsi.'}
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-2">Keahlian</h3>
                        <div className="flex flex-wrap gap-2">
                            {worker.skills?.map((skill: string) => (
                                <span key={skill} className="text-xs bg-muted px-3 py-1.5 rounded-full text-foreground/80">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Portfolio (Mock for now as it's not in main table) */}
                <div className="p-4 bg-white mt-2 border-y border-border">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Portofolio</h3>
                        <Link href="#" className="text-sm text-primary">Lihat Semua</Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative h-32 w-48 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                    src={`https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=400&h=300&fit=crop&random=${i}`}
                                    alt={`Portfolio ${i}`}
                                    fill
                                    className="object-cover"
                                />
                            </div >
                        ))}
                    </div >
                </div >
            </main >

            {/* Sticky Booking Action */}
            < div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 pb-safe z-50" >
                <div className="mx-auto max-w-[480px] flex gap-3 items-center">
                    <div className="flex-1">
                        <div className="text-xs text-muted-foreground">Biaya mulai</div>
                        <div className="text-lg font-bold text-secondary">{worker.price_range}</div>
                    </div>
                    <Link href="/chat">
                        <Button variant="outline" size="icon" className="shrink-0">
                            <MessageCircle className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/booking" className="flex-1">
                        <Button className="w-full">
                            Pesan Sekarang
                        </Button>
                    </Link>
                </div>
            </div >
        </MobileContainer >
    );
}
