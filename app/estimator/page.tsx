"use client";

import React, { useState } from 'react';
import { Camera, Sparkles, ArrowRight, Check } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import Image from 'next/image';

export default function SmartEstimatorPage() {
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setImage(url);
            setResult(null);
        }
    };

    const analyzeImage = () => {
        setAnalyzing(true);
        // Simulate AI analysis
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                problem: 'Kerusakan Pipa Wastafel',
                severity: 'Sedang',
                estimated_cost: 'Rp 75.000 - Rp 150.000',
                estimated_time: '1 - 2 Jam',
                materials: ['Lem Pipa', 'Sealant', 'Pipa PVC 1/2 inch (Mungkin)'],
                recommendation: 'Sebaiknya segera diperbaiki sebelum merusak kabinet bawah.'
            });
        }, 2000);
    };

    return (
        <MobileContainer>
            <Header />

            <main className="p-4 space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-5 w-5 text-accent" />
                        <h1 className="text-xl font-bold">AI Job Estimator</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Upload foto kerusakan, AI kami akan memperkirakan biaya dan kebutuhan perbaikan.
                    </p>
                </div>

                {/* Upload Area */}
                <div className="space-y-4">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center group">
                        {image ? (
                            <Image src={image} alt="Preview" fill className="object-cover" />
                        ) : (
                            <div className="text-center p-6">
                                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <Camera className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-medium">Ketuk untuk ambil foto</p>
                                <p className="text-xs text-muted-foreground mt-1">atau pilih dari galeri</p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {image && !result && (
                        <Button
                            className="w-full"
                            onClick={analyzeImage}
                            isLoading={analyzing}
                        >
                            {analyzing ? 'Menganalisa...' : 'Analisa Sekarang'}
                        </Button>
                    )}
                </div>

                {/* Result Card */}
                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <Card className="border-primary/20 shadow-lg overflow-hidden">
                            <div className="bg-primary/5 p-4 border-b border-primary/10">
                                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-accent" />
                                    Hasil Analisa AI
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Deteksi Masalah</div>
                                    <div className="font-medium text-lg">{result.problem}</div>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                        Tingkat Kerusakan: {result.severity}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-xl">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Estimasi Biaya</div>
                                        <div className="font-bold text-secondary">{result.estimated_cost}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Waktu Pengerjaan</div>
                                        <div className="font-bold text-foreground">{result.estimated_time}</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">Kemungkinan Material</div>
                                    <ul className="space-y-1">
                                        {result.materials.map((m: string, i: number) => (
                                            <li key={i} className="text-sm flex items-center gap-2">
                                                <Check className="h-3 w-3 text-green-500" />
                                                {m}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>

                        <Button className="w-full">
                            Cari Tukang Terkait
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </main>
        </MobileContainer>
    );
}
