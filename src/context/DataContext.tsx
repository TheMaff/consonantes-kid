// src/context/DataContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

export interface SentencePart {
    type: "text" | "blank";
    value: string;
}

export interface Consonant {
    id: string;
    order: number;
    label: string;
    words: Word[];
}

// Define cada eslabón de la cadena
export interface ChainStep {
    word: string;        // La nueva palabra (ej: "sal")
    image: string;       // La nueva imagen
    changeIndex: number; // ¿Qué letra se cae? (0 = primera, 1 = segunda, etc.)
    options: string[];   // Las letras falsas y la verdadera para elegir
}

export interface Word {
    id: string;
    text: string;
    image: string;
    alt: string;
    hints?: string; // Lo dejamos opcional por si las oraciones no llevan pistas

    // 👇 NUEVOS CAMPOS PARA TEXTOS DECODIFICABLES 👇
    type?: "word" | "sentence" | "chain"; // Si no viene, asumimos que es "word" normal
    sentenceParts?: SentencePart[]; // Partes de la oración
    options?: string[]; // Las "fichas" para arrastrar

    // 👇 NUEVO: Para las cadenas de palabras (Fase 3) 👇
    chainSteps?: ChainStep[];
}

interface DataCtx {
    consonants: Consonant[];
    loading: boolean;
}

const Ctx = createContext<DataCtx>({ consonants: [], loading: true });

export const useData = () => useContext(Ctx);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [consonants, setCons] = useState<Consonant[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // fetch(import.meta.env.VITE_JSON_URL)
        // Apuntamos directamente a la ruta pública local
        fetch("/data/palabras_metodo_silabico.json")
            .then((r) => r.json())
            .then((json) => {
                setCons(json.consonants);
            })
            .catch((err) => {
                console.error("Error cargando el JSON local:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Ctx.Provider value={{ consonants, loading }}>
            {children}
        </Ctx.Provider>
    );
}
