"use client";

import React, { useState, useEffect } from 'react';
import { Mic, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export function VoiceOrderButton() {
    const router = useRouter();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            // @ts-ignore
            const speech = new window.webkitSpeechRecognition();
            speech.continuous = false;
            speech.lang = 'id-ID';
            speech.interimResults = false;

            speech.onstart = () => setIsListening(true);
            speech.onend = () => setIsListening(false);
            speech.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                processVoiceCommand(text);
            };

            setRecognition(speech);
        }
    }, []);

    const startListening = () => {
        if (recognition) {
            recognition.start();
        } else {
            // Fallback for demo if API not supported
            setIsListening(true);
            setTimeout(() => {
                const mockText = "Saya butuh tukang service AC di Batam Center";
                setTranscript(mockText);
                setIsListening(false);
                processVoiceCommand(mockText);
            }, 2000);
        }
    };

    const processVoiceCommand = (text: string) => {
        // Simple keyword matching for demo
        let category = 'Lainnya';
        if (text.toLowerCase().includes('ac')) category = 'Service AC';
        if (text.toLowerCase().includes('listrik')) category = 'Listrik';
        if (text.toLowerCase().includes('air') || text.toLowerCase().includes('pipa')) category = 'Pipa Air';

        // Redirect to booking with pre-filled data
        setTimeout(() => {
            router.push(`/booking?category=${encodeURIComponent(category)}&description=${encodeURIComponent(text)}`);
        }, 1000);
    };

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors ${isListening ? 'text-red-500 animate-pulse' : ''}`}
                onClick={startListening}
            >
                <Mic className="h-5 w-5" />
            </Button>

            {/* Listening Overlay */}
            {isListening && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 w-[80%] max-w-sm">
                        <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                            <Mic className="h-10 w-10 text-red-600" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="font-bold text-lg">Mendengarkan...</h3>
                            <p className="text-sm text-muted-foreground">Katakan kebutuhan Anda, misal: <br />"Service AC bocor di Nagoya"</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                            if (recognition) recognition.stop();
                            setIsListening(false);
                        }}>
                            Batal
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
