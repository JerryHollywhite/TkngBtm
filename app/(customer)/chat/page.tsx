"use client";

import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

const MOCK_MESSAGES = [
    { id: 1, sender: 'worker', text: 'Halo, saya sudah dalam perjalanan ke lokasi Anda', time: '10:30', isOwn: false },
    { id: 2, sender: 'customer', text: 'Baik, saya tunggu. Kira-kira berapa lama lagi?', time: '10:32', isOwn: true },
    { id: 3, sender: 'worker', text: 'Sekitar 15 menit lagi sampai', time: '10:33', isOwn: false },
    { id: 4, sender: 'customer', text: 'Oke siap, terima kasih', time: '10:34', isOwn: true },
];

export default function ChatPage() {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([
                ...messages,
                {
                    id: messages.length + 1,
                    sender: 'customer',
                    text: newMessage,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    isOwn: true,
                },
            ]);
            setNewMessage('');
        }
    };

    return (
        <MobileContainer className="flex flex-col h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white px-4">
                <div className="flex items-center gap-3 flex-1">
                    <Link href="/orders">
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">BS</span>
                        </div>
                        <div>
                            <div className="font-semibold">Budi Santoso</div>
                            <div className="text-xs text-muted-foreground">Service AC</div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.isOwn
                                    ? 'bg-primary text-white rounded-br-sm'
                                    : 'bg-white border border-border rounded-bl-sm'
                                }`}
                        >
                            <p className="text-sm">{msg.text}</p>
                            <span
                                className={`text-[10px] mt-1 block ${msg.isOwn ? 'text-blue-100' : 'text-muted-foreground'
                                    }`}
                            >
                                {msg.time}
                            </span>
                        </div>
                    </div>
                ))}
            </main>

            {/* Input */}
            <form
                onSubmit={handleSend}
                className="sticky bottom-0 border-t border-border bg-white p-4 pb-safe"
            >
                <div className="flex gap-2 items-center">
                    <Button type="button" variant="ghost" size="icon" className="shrink-0">
                        <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Input
                        placeholder="Ketik pesan..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="shrink-0 btn-gradient"
                        disabled={!newMessage.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </form>
        </MobileContainer>
    );
}
