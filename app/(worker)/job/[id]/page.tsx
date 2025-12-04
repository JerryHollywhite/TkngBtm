"use client";

import React, { useState, useEffect, use } from 'react';
import { ArrowLeft, MapPin, Phone, MessageCircle, Camera, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function WorkerJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progressDescription, setProgressDescription] = useState('');
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setJob(data);
            setProgressPercentage(data.progress_percentage || 0);
        } catch (error) {
            console.error('Error fetching job:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchJobDetails();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Gagal update status');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleProgressUpdate = async () => {
        if (!progressDescription) {
            alert('Mohon isi deskripsi pekerjaan');
            return;
        }

        // Validation: Progress cannot decrease
        if (progressPercentage < (job.progress_percentage || 0)) {
            alert('Progress tidak boleh turun dari sebelumnya!');
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Insert into history
            const { error: historyError } = await supabase
                .from('booking_progress')
                .insert({
                    booking_id: id,
                    percentage: progressPercentage,
                    description: progressDescription,
                    photo_url: 'https://images.unsplash.com/photo-1581578731117-104f8a746956?w=400' // Mock photo for now
                });

            if (historyError) throw historyError;

            // 2. Update main booking
            const { error: bookingError } = await supabase
                .from('bookings')
                .update({
                    progress_percentage: progressPercentage,
                    status: progressPercentage === 100 ? 'review' : 'working'
                })
                .eq('id', id);

            if (bookingError) throw bookingError;

            alert('Progress berhasil diupdate!');
            fetchJobDetails();
            setProgressDescription('');
        } catch (error) {
            console.error('Error updating progress:', error);
            alert('Gagal update progress');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <MobileContainer className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </MobileContainer>
        );
    }

    if (!job) return <div>Job not found</div>;

    return (
        <MobileContainer className="pb-24">
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur-md">
                <Link href="/worker/dashboard">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <span className="font-semibold">Detail Pekerjaan</span>
                <div className="w-10" />
            </header>

            <main className="p-4 space-y-6">
                {/* Customer Info */}
                <div className="bg-white rounded-xl border border-border p-4 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="font-bold text-lg">{job.service_category}</h2>
                            <p className="text-sm text-muted-foreground">Order #{job.id.slice(0, 8)}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase">
                            {job.status.replace(/_/g, ' ')}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 border-t border-border pt-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                            C
                        </div>
                        <div className="flex-1">
                            <div className="font-medium">Customer</div>
                            <div className="text-xs text-muted-foreground">Pelanggan</div>
                        </div>
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Link href="/chat">
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                <MessageCircle className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-2">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span>Jadwal: {new Date(job.scheduled_at).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Deskripsi Masalah</h3>
                    <p className="text-sm text-muted-foreground bg-white p-3 rounded-xl border border-border">
                        {job.description || 'Tidak ada deskripsi tambahan.'}
                    </p>
                </div>

                {/* Status Actions */}
                <div className="space-y-3">
                    <h3 className="font-semibold">Update Status</h3>

                    {job.status === 'accepted' && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center space-y-3">
                            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900">Siap Berangkat?</h4>
                                <p className="text-sm text-blue-700">Beri tahu pelanggan bahwa Anda sedang menuju lokasi.</p>
                            </div>
                            <Button className="w-full" onClick={() => updateStatus('on_the_way')} disabled={isSubmitting}>
                                Saya OTW Sekarang
                            </Button>
                        </div>
                    )}

                    {job.status === 'on_the_way' && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center space-y-3">
                            <div className="h-12 w-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-yellow-900">Sudah Sampai?</h4>
                                <p className="text-sm text-yellow-700">Konfirmasi kedatangan Anda untuk mulai bekerja.</p>
                            </div>
                            <Button className="w-full" onClick={() => updateStatus('working')} disabled={isSubmitting}>
                                Saya Sudah Sampai & Mulai Kerja
                            </Button>
                        </div>
                    )}

                    {(job.status === 'working' || job.status === 'review') && (
                        <div className="space-y-4 bg-white p-4 rounded-xl border border-border">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Progress Pekerjaan ({progressPercentage}%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="10"
                                    value={progressPercentage}
                                    onChange={(e) => setProgressPercentage(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            <Textarea
                                placeholder="Deskripsikan apa yang sudah dikerjakan..."
                                value={progressDescription}
                                onChange={(e) => setProgressDescription(e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="w-full">
                                    <Camera className="h-4 w-4 mr-2" />
                                    Foto
                                </Button>
                                <Button
                                    className="w-full"
                                    onClick={handleProgressUpdate}
                                    disabled={isSubmitting}
                                >
                                    {progressPercentage === 100 ? 'Selesai & Review' : 'Update Progress'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {job.status === 'completed' && (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center space-y-4">
                            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="font-bold text-green-900 text-lg">Pekerjaan Selesai!</h4>
                                <p className="text-sm text-green-700">Dana akan diteruskan ke dompet Anda.</p>
                            </div>
                            <Link href="/worker/dashboard">
                                <Button className="w-full" variant="outline">
                                    Kembali ke Dashboard
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </MobileContainer>
    );
}
