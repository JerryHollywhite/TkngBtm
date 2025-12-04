"use client";

import React, { useState } from 'react';
import { ArrowLeft, Camera, MapPin, Calendar, Clock, Upload, Loader2 } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Suspense } from 'react';

function BookingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [files, setFiles] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Service AC',
        location: 'Jl. Engku Putri No. 1, Batam Center',
        scheduledDate: '',
        scheduledTime: '',
    });

    React.useEffect(() => {
        const categoryParam = searchParams.get('category');
        const descriptionParam = searchParams.get('description');

        if (categoryParam || descriptionParam) {
            setFormData(prev => ({
                ...prev,
                category: categoryParam || prev.category,
                description: descriptionParam || prev.description,
                title: descriptionParam ? 'Pesanan Via Suara' : prev.title
            }));
        }
    }, [searchParams]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Mock file upload preview
            const url = URL.createObjectURL(e.target.files[0]);
            setFiles([...files, url]);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('Anda harus login terlebih dahulu');
                router.push('/login');
                return;
            }

            // For now, we'll use the first worker from database as mock assignment
            const { data: workers } = await supabase
                .from('workers')
                .select('id')
                .limit(1)
                .single();

            if (!workers) {
                alert('Tidak ada tukang tersedia saat ini');
                return;
            }

            // Combine date and time
            const scheduledAt = `${formData.scheduledDate}T${formData.scheduledTime}:00`;

            // Insert booking
            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    customer_id: user.id,
                    worker_id: workers.id,
                    service_category: formData.category,
                    description: `${formData.title} \n\n${formData.description} `,
                    location: formData.location,
                    scheduled_at: scheduledAt,
                    status: 'pending',
                    progress_percentage: 0,
                    total_price: 75000, // Mock price
                })
                .select()
                .single();

            if (error) throw error;

            alert('Pesanan berhasil dibuat! ✅');
            router.push('/orders');
        } catch (error: any) {
            console.error('Error creating booking:', error);
            alert(`Gagal membuat pesanan: ${error.message} `);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MobileContainer className="pb-24">
            <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-white/80 px-4 backdrop-blur-md">
                <Link href="/search">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <span className="font-semibold ml-2">Buat Pesanan</span>
            </header>

            <main className="p-4">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8 px-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= i ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                {i}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                                {i === 1 ? 'Detail' : i === 2 ? 'Jadwal' : 'Review'}
                            </span>
                        </div>
                    ))}
                    <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -z-10" />
                </div>

                {step === 1 && (
                    <div className="space-y-4 animate-in slide-in-from-right-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Judul Masalah</label>
                            <Input
                                placeholder="Contoh: AC Bocor, Lampu Mati"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kategori Layanan</label>
                            <select
                                className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Service AC</option>
                                <option>Listrik</option>
                                <option>Pipa Air</option>
                                <option>Renovasi</option>
                                <option>Cleaning</option>
                                <option>Lainnya</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Deskripsi Detail</label>
                            <Textarea
                                placeholder="Jelaskan masalahnya secara detail..."
                                className="min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Foto (Opsional)</label>
                            <div className="grid grid-cols-3 gap-3">
                                <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                                    <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                                    <span className="text-[10px] text-muted-foreground">Tambah</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                                {files.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-border">
                                        <img src={url} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button className="w-full mt-4" onClick={() => setStep(2)}>
                            Lanjut: Lokasi & Jadwal
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in slide-in-from-right-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lokasi Pengerjaan</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    className="pl-10"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="h-32 bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm border border-border">
                                Peta Lokasi (Mock Map)
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tanggal</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="date"
                                        className="pl-9"
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Jam</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="time"
                                        className="pl-9"
                                        value={formData.scheduledTime}
                                        onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                Kembali
                            </Button>
                            <Button className="flex-1" onClick={() => setStep(3)}>
                                Lanjut: Review
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4">
                        <div className="bg-muted/30 p-4 rounded-xl space-y-3 border border-border">
                            <h3 className="font-bold text-lg">Ringkasan Pesanan</h3>

                            <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">Masalah</div>
                                <div className="font-medium">{formData.title}</div>
                                <div className="text-sm text-muted-foreground">{formData.description}</div>
                            </div>

                            <div className="h-px bg-border" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground">Kategori</div>
                                    <div className="font-medium">{formData.category}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Jadwal</div>
                                    <div className="font-medium">{formData.scheduledDate}, {formData.scheduledTime}</div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">Lokasi</div>
                                <div className="font-medium">{formData.location}</div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center border border-blue-100">
                            <span className="text-blue-900 font-medium">Estimasi Biaya</span>
                            <span className="text-blue-700 font-bold text-lg">Rp 75.000</span>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                                Kembali
                            </Button>
                            <Button className="flex-1 btn-gradient" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    'Buat Pesanan'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </MobileContainer>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
            <BookingForm />
        </Suspense>
    );
}
