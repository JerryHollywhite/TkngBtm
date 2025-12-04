"use client";

import React, { useState } from 'react';
import { Camera, MapPin, CheckCircle, Upload } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function WorkerOnboardingPage() {
    const [step, setStep] = useState(1);

    return (
        <MobileContainer className="p-6">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-primary">Daftar Jadi Mitra</h1>
                    <p className="text-muted-foreground">Bergabung dengan ribuan tukang profesional lainnya.</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-2 w-16 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h2 className="font-semibold text-lg">Data Diri</h2>
                        <Input placeholder="Nama Lengkap (Sesuai KTP)" />
                        <Input placeholder="Nomor WhatsApp" type="tel" />
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Foto KTP</label>
                            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                                <Camera className="h-8 w-8 mb-2" />
                                <span className="text-xs">Ketuk untuk ambil foto</span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h2 className="font-semibold text-lg">Keahlian & Area</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {['Service AC', 'Listrik', 'Bangunan', 'Pipa Air', 'Cat', 'Lainnya'].map((skill) => (
                                <button key={skill} className="border border-border rounded-xl p-3 text-sm font-medium hover:border-primary hover:bg-primary/5 transition-colors text-left">
                                    {skill}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium">Area Layanan Utama</label>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 justify-start text-muted-foreground font-normal">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Pilih Lokasi di Peta
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300 py-8">
                        <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-12 w-12" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Pendaftaran Terkirim!</h2>
                            <p className="text-muted-foreground text-sm">
                                Data Anda sedang diverifikasi oleh tim kami. Proses ini biasanya memakan waktu 1x24 jam.
                            </p>
                        </div>
                    </div>
                )}

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border">
                    <div className="max-w-[480px] mx-auto">
                        {step < 3 ? (
                            <Button className="w-full" onClick={() => setStep(step + 1)}>
                                Lanjut
                            </Button>
                        ) : (
                            <Link href="/worker/dashboard">
                                <Button className="w-full">
                                    Masuk ke Dashboard
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </MobileContainer>
    );
}
