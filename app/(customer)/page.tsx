"use client";

import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star, ArrowRight, Loader2 } from 'lucide-react';
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
import { VoiceOrderButton } from '@/components/features/VoiceOrderButton';

const CATEGORIES = [
  { id: 'ac', name: 'Service AC', icon: '❄️', color: 'bg-blue-100' },
  { id: 'electric', name: 'Listrik', icon: '⚡', color: 'bg-yellow-100' },
  { id: 'plumbing', name: 'Pipa Air', icon: '🚰', color: 'bg-cyan-100' },
  { id: 'paint', name: 'Cat Dinding', icon: '🎨', color: 'bg-purple-100' },
  { id: 'build', name: 'Renovasi', icon: '🔨', color: 'bg-orange-100' },
  { id: 'clean', name: 'Cleaning', icon: '🧹', color: 'bg-green-100' },
  { id: 'massage', name: 'Pijat', icon: '💆', color: 'bg-pink-100' },
  { id: 'more', name: 'Lainnya', icon: '⋯', color: 'bg-gray-100' },
];

export default function Home() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchWorkers() {
      try {
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .limit(5);

        if (error) throw error;
        if (data) setWorkers(data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <MobileContainer>
      <Header />

      <main className="flex-1 space-y-6 p-4 pb-24">
        {/* Hero / Search Section */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-primary">
              Cari Tukang? <br />
              <span className="text-secondary">Beresin Aja!</span>
            </h2>
            <p className="text-muted-foreground">Solusi cepat untuk masalah rumahmu.</p>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <Input
              placeholder="Cari 'Service AC' atau 'Bocor'..."
              icon={<Search className="h-5 w-5" />}
              className="shadow-sm pr-10" // Add padding right for the button
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <VoiceOrderButton />
          </form>
        </section>

        {/* Categories */}
        <section className="animate-in fade-in slide-in-from-bottom-4 delay-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Kategori Layanan</h3>
            <Link href="/categories" className="text-sm text-primary font-medium">Lihat Semua</Link>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/search?category=${cat.id}`} className="flex flex-col items-center gap-2 group">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${cat.color} group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="text-[11px] font-medium text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="animate-in fade-in slide-in-from-bottom-4 delay-200">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-4 text-white shadow-md relative overflow-hidden group">
            <div className="relative z-10 w-2/3">
              <h3 className="font-bold text-lg mb-1">Diskon 20%</h3>
              <p className="text-sm text-blue-100 mb-3">Untuk pengguna baru jasa cleaning.</p>
              <Button size="sm" variant="secondary" className="h-8 text-xs">
                Ambil Promo
              </Button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500">
              <Star className="h-32 w-32 fill-current" />
            </div>
          </div>
        </section>

        {/* Featured Workers */}
        <section className="animate-in fade-in slide-in-from-bottom-4 delay-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Tukang Pilihan</h3>
            <Link href="/search" className="text-sm text-primary font-medium">Lihat Semua</Link>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <>
                <WorkerCardSkeleton />
                <WorkerCardSkeleton />
                <WorkerCardSkeleton />
              </>
            ) : workers.length > 0 ? (
              workers.map((worker) => (
                <Link key={worker.id} href={`/worker/${worker.id}`}>
                  <Card className="overflow-hidden active:scale-[0.98] transition-transform mb-3">
                    <div className="flex p-3 gap-3">
                      <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={worker.image_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'}
                          alt={worker.full_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-primary line-clamp-1">{worker.full_name}</h4>
                            <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {worker.rating}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{worker.category}</p>
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
              <div className="text-center py-8 text-muted-foreground">
                Belum ada data tukang.
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </MobileContainer>
  );
}
