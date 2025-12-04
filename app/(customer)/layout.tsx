import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "TukangBatam - Solusi Rumahmu",
    description: "Platform jasa tukang terpercaya di Batam",
};

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <BottomNav />
        </>
    );
}
