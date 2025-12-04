"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Briefcase, Users } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<'customer' | 'worker'>('customer');

    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam === 'worker') {
            setRole('worker');
            setIsLogin(false); // Auto switch to register for worker links
        } else if (roleParam === 'customer') {
            setRole('customer');
            setIsLogin(false); // Auto switch to register for customer links
        }
    }, [searchParams]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // 1. Sign In
                const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (signInError) throw signInError;

                // 2. Check Role
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single();

                    const userRole = profile?.role || 'customer';

                    // 3. Redirect based on role
                    if (userRole === 'admin') router.push('/admin');
                    else if (userRole === 'worker') router.push('/worker/dashboard');
                    else router.push('/');
                }
            } else {
                // 1. Sign Up
                const { error: signUpError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName,
                            role: role, // Pass role to metadata
                        },
                    },
                });
                if (signUpError) throw signUpError;
                alert('Registrasi berhasil! Silakan cek email untuk verifikasi.');
                setIsLogin(true);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Terjadi kesalahan');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MobileContainer className="bg-white min-h-screen flex flex-col justify-center p-6">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-primary mb-2">
                    {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
                </h1>
                <p className="text-muted-foreground text-sm">
                    {isLogin
                        ? 'Masuk untuk mengakses layanan tukang terbaik.'
                        : role === 'worker'
                            ? 'Daftar sebagai Mitra Tukang dan mulai terima pesanan.'
                            : 'Daftar sekarang dan temukan solusi rumahmu.'}
                </p>
            </div>

            {/* Role Selection (Only for Register) */}
            {!isLogin && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div
                        onClick={() => setRole('customer')}
                        className={`cursor-pointer p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'customer'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                            }`}
                    >
                        <Users className="h-6 w-6" />
                        <span className="text-xs font-bold">Pelanggan</span>
                    </div>
                    <div
                        onClick={() => setRole('worker')}
                        className={`cursor-pointer p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'worker'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                            }`}
                    >
                        <Briefcase className="h-6 w-6" />
                        <span className="text-xs font-bold">Mitra Tukang</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <Input
                        label="Nama Lengkap"
                        placeholder="Contoh: Budi Santoso"
                        icon={<User className="h-5 w-5 text-muted-foreground" />}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />
                )}

                <Input
                    label="Email"
                    type="email"
                    placeholder="nama@email.com"
                    icon={<Mail className="h-5 w-5 text-muted-foreground" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        icon={<Lock className="h-5 w-5 text-muted-foreground" />}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <div className="pt-2">
                    <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                        {isLogin ? 'Masuk Sekarang' : 'Daftar Akun'}
                        {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Atau masuk dengan</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">
                        Google
                    </Button>
                    <Button variant="outline" className="w-full">
                        Facebook
                    </Button>
                </div>

                <p className="mt-8 text-sm text-muted-foreground">
                    {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-bold text-primary hover:underline"
                    >
                        {isLogin ? 'Daftar disini' : 'Masuk disini'}
                    </button>
                </p>
            </div>
        </MobileContainer>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
