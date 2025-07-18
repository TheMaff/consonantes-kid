// src/hooks/useSpeechCheck.ts
import { useRef } from "react";

export const useSpeechCheck = (target: string, onOk: () => void) => {
    const rec = useRef<SpeechRecognition | null>(null);

    const start = () => {
        const SpeechRec =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        rec.current = new SpeechRec();
        if (rec.current) {

            rec.current.lang = "es-CL";
            rec.current.onresult = (e: any) => {
                const said = e.results[0][0].transcript.trim().toLowerCase();
                if (said.includes(target.toLowerCase())) onOk();
            };
            rec.current.start();
        }
    };

    return { start };
};
