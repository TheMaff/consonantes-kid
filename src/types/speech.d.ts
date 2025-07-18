// src/types/speech.d.ts
/* Simplificación: suficiente para compilar */
interface SpeechRecognition extends EventTarget {
    lang: string;
    onresult: ((e: any) => void) | null;
    start(): void;
}

interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}
