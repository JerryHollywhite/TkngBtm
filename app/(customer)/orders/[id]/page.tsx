"use client";

import React from 'react';
import { ArrowLeft, CheckCircle, Clock, MapPin, MessageCircle, Phone, Camera, ChevronRight } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    // Mock order status
    const status = 'working'; // pending, otw, working, done

    const steps = [
        { id: 1, label: 'Pesanan Diterima', time: '13:30', done: true },
        { id: 2, label: 'Tukang Menuju Lokasi', time: '13:45', done: true },
        { id: 3, label: 'Pengerjaan Dimulai', time: '14:10', done: true },
        { id: 4, label: 'Pekerjaan Selesai', time: '-', done: false },
    ];

    return (
        <MobileContainer className="pb-24">
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur-md">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <span className="font-semibold">Detail Pesanan</span>
                <div className="w-10" />
            </header>

            <main className="p-4 space-y-6">
                {/* Status Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="font-bold text-blue-900">Sedang Dikerjakan</h2>
                        <p className="text-sm text-blue-700">Estimasi selesai 15:30 WIB</p>
                    </div>
                </div>

                {/* Worker Info */}
                <Card>
                    <div className="p-4 flex gap-4 items-center">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gray-200">
                            <Image
                                src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&h=200&fit=crop"
                                alt="Worker"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-lg">Pak Budi Santoso</div>
                            <div className="text-sm text-muted-foreground">Ahli Listrik • 4.8 ⭐</div>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/chat">
                                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                    <MessageCircle className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                <Phone className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Timeline */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Status Pengerjaan</h3>
                    <div className="relative pl-4 border-l-2 border-muted space-y-8">
                        {steps.map((step, i) => (
                            <div key={step.id} className="relative">
                                <div className={`absolute -left-[21px] top-0 h-4 w-4 rounded-full border-2 border-white ring-1 ${step.done ? 'bg-green-500 ring-green-500' : 'bg-gray-300 ring-gray-300'}`} />
                                <div className="flex justify-between items-start -mt-1">
                                    <div>
                                        <div className={`font-medium ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</div>
                                        {step.id === 3 && step.done && (
                                            <div className="mt-2">
                                                <div className="text-xs text-muted-foreground mb-1">Foto Progress:</div>
                                                <div className="flex gap-2">
                                                    <div className="h-16 w-16 bg-gray-100 rounded-lg border border-border flex items-center justify-center">
                                                        <Camera className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{step.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Details */}
                <div className="space-y-2">
                    <h3 className="font-bold text-lg">Rincian</h3>
                    <Card className="bg-muted/30">
                        <div className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Layanan</span>
                                <span className="font-medium">Service AC</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Lokasi</span>
                                <span className="font-medium text-right max-w-[200px]">Jl. Engku Putri No. 1, Batam Center</span>
                            </div>
                            <div className="h-px bg-border my-2" />
                            <div className="flex justify-between text-base font-bold">
                                <span>Total Estimasi</span>
                                <span className="text-secondary">Rp 75.000</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border z-50">
                <div className="max-w-[480px] mx-auto">
                    <Button variant="outline" className="w-full text-error hover:text-error hover:bg-error/10">
                        Batalkan Pesanan
                    </Button>
                </div>
            </div>
        </MobileContainer>
    );
}
