import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "TukangBatam - Dashboard Tukang",
    description: "Dashboard untuk tukang profesional",
};

export default function WorkerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
