"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Briefcase, Users, Shield } from 'lucide-react';
// ... imports

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<'customer' | 'worker' | 'admin'>('customer');

    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam === 'worker') {
            setRole('worker');
            setIsLogin(false);
        } else if (roleParam === 'customer') {
            setRole('customer');
            setIsLogin(false);
        } else if (roleParam === 'admin') {
            setRole('admin');
            setIsLogin(false);
        }
    }, [searchParams]);

    // ... formData state and handleSubmit ...

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
                            : role === 'admin'
                                ? 'Daftar sebagai Administrator sistem.'
                                : 'Daftar sekarang dan temukan solusi rumahmu.'}
                </p>
            </div>

            {/* Role Selection (Only for Register) */}
            {!isLogin && (
                <div className={`grid gap-3 mb-6 ${searchParams.get('role') ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {(!searchParams.get('role') || searchParams.get('role') === 'customer') && (
                        <div
                            onClick={() => !searchParams.get('role') && setRole('customer')}
                            className={`cursor-pointer p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'customer'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border hover:border-primary/50'
                                } ${searchParams.get('role') ? 'cursor-default' : ''}`}
                        >
                            <Users className="h-6 w-6" />
                            <span className="text-xs font-bold">Pelanggan</span>
                        </div>
                    )}
                    {(!searchParams.get('role') || searchParams.get('role') === 'worker') && (
                        <div
                            onClick={() => !searchParams.get('role') && setRole('worker')}
                            className={`cursor-pointer p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'worker'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border hover:border-primary/50'
                                } ${searchParams.get('role') ? 'cursor-default' : ''}`}
                        >
                            <Briefcase className="h-6 w-6" />
                            <span className="text-xs font-bold">Mitra Tukang</span>
                        </div>
                    )}
                    {/* Admin Option (Only visible via URL) */}
                    {searchParams.get('role') === 'admin' && (
                        <div
                            className="cursor-default p-3 rounded-xl border-2 border-primary bg-primary/5 text-primary flex flex-col items-center gap-2 transition-all"
                        >
                            <Shield className="h-6 w-6" />
                            <span className="text-xs font-bold">Administrator</span>
                        </div>
                    )}
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
