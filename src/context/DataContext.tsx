// src/context/DataContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

export interface Word {
    id: string;
    text: string;
    image: string;
    alt: string;
}

export interface Consonant {
    id: string;
    order: number;
    label: string;
    words: Word[];
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
        fetch(import.meta.env.VITE_JSON_URL)
            .then((r) => r.json())
            .then((json) => {
                setCons(json.consonants);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Ctx.Provider value={{ consonants, loading }}>
            {children}
        </Ctx.Provider>
    );
}
