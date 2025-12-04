import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string;
    height?: string;
}

export function Skeleton({ className, variant = 'rectangular', width, height, ...props }: SkeletonProps) {
    return (
        <div
            className={clsx(
                'animate-pulse bg-muted',
                variant === 'circular' && 'rounded-full',
                variant === 'rectangular' && 'rounded-lg',
                variant === 'text' && 'rounded h-4',
                className
            )}
            style={{ width, height }}
            {...props}
        />
    );
}

export function WorkerCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
            <div className="flex gap-3">
                <Skeleton variant="rectangular" className="h-20 w-20 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="h-5 w-32" />
                    <Skeleton variant="text" className="h-4 w-24" />
                    <div className="flex gap-2 mt-3">
                        <Skeleton variant="rectangular" className="h-4 w-16" />
                        <Skeleton variant="rectangular" className="h-4 w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
}
