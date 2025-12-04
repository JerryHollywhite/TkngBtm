"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Search as SearchIcon, Map, Filter, Star, MapPin, Loader2 } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton, WorkerCardSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

type FilterType = 'all' | 'nearest' | 'rating' | 'price';

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    const categoryParam = searchParams.get('category') || '';

    const [workers, setWorkers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    useEffect(() => {
        fetchWorkers();
    }, [searchQuery, activeFilter, categoryParam]);

    const fetchWorkers = async () => {
        setIsLoading(true);
        try {
            let query = supabase.from('workers').select('*');

            // Search by query
            if (searchQuery) {
                query = query.or(`full_name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`);
            }

            // Filter by category
            if (categoryParam) {
                const categoryMap: Record<string, string> = {
                    'ac': 'Service AC',
                    'electric': 'Listrik',
                    'plumbing': 'Pipa',
                    'paint': 'Cat',
                    'build': 'Renovasi',
                    'clean': 'Cleaning',
                };
                const categoryName = categoryMap[categoryParam];
                if (categoryName) {
                    query = query.ilike('category', `%${categoryName}%`);
                }
            }

            // Apply filters
            if (activeFilter === 'rating') {
                query = query.gte('rating', 4.5).order('rating', { ascending: false });
            } else if (activeFilter === 'price') {
                query = query.order('price_range', { ascending: true });
            } else {
                query = query.order('rating', { ascending: false });
            }

            const { data, error } = await query;

            if (error) throw error;
            setWorkers(data || []);
        } catch (error) {
            console.error('Error fetching workers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchWorkers();
    };

    const filters = [
        { id: 'all', label: 'Semua' },
        { id: 'nearest', label: 'Terdekat' },
        { id: 'rating', label: 'Rating 4.5+' },
        { id: 'price', label: 'Harga Terendah' },
    ];

    return (
        <MobileContainer>
            <Header />

            <div className="sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 space-y-3 border-b border-border">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <Input
                        placeholder="Cari tukang..."
                        icon={<SearchIcon className="h-5 w-5" />}
                        className="h-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-xl">
                        <Map className="h-5 w-5" />
                    </Button>
                </form>

                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id as FilterType)}
                            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${activeFilter === filter.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-1 p-4 space-y-4 pb-24">
                {isLoading ? (
                    <>
                        <WorkerCardSkeleton />
                        <WorkerCardSkeleton />
                        <WorkerCardSkeleton />
                    </>
                ) : workers.length > 0 ? (
                    workers.map((worker) => (
                        <Link key={worker.id} href={`/worker/${worker.id}`}>
                            <Card className="overflow-hidden active:scale-[0.99] transition-transform">
                                <div className="flex p-3 gap-3">
                                    <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                        <Image
                                            src={worker.image_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'}
                                            alt={worker.full_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-0.5">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-primary">{worker.full_name}</h4>
                                                <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    {worker.rating}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{worker.category}</p>
                                        </div>

                                        <div className="flex items-center gap-2 mt-1">
                                            {worker.skills?.slice(0, 2).map((skill: string) => (
                                                <span key={skill} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {worker.location}
                                            </div>
                                            <span className="text-sm font-bold text-secondary">{worker.price_range}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-16">
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <SearchIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Tidak Ada Hasil</h3>
                        <p className="text-muted-foreground">
                            Coba kata kunci lain atau ubah filter
                        </p>
                    </div>
                )}
            </main>

            <BottomNav />
        </MobileContainer>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <SearchContent />
        </Suspense>
    );
}
