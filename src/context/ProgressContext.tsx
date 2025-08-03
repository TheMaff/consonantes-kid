// src/context/ProgressContext.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { consonantList } from "../data/consonants";

type ProgressRow = {
    consonant: string;
    word_index: number;
    done: boolean;
};

type ProgressState = Record<string, ProgressRow>;

interface ProgressCtx {
    progress: ProgressState;
    isUnlocked: (consonantId: string, idx: number) => boolean;
    completeWord: (
        consonantId: string,
        totalWords: number
    ) => Promise<void>;
}

const ProgressContext = createContext<ProgressCtx | undefined>(undefined);

export const useProgress = () => {
    const ctx = useContext(ProgressContext);
    if (!ctx) throw new Error("useProgress debe usarse dentro de <ProgressProvider>");
    return ctx;
};

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [progress, setProgress] = useState<ProgressState>({});

    /** 1️⃣ Carga inicial desde Supabase */
    useEffect(() => {
        (async () => {
            const { data: rows, error } = await supabase
                .from("user_progress")
                .select("*");
            if (error) {
                console.error(error);
                return;
            }
            const map: ProgressState = {};
            rows?.forEach((r) => {
                map[r.consonant] = r;
            });
            setProgress(map);
        })();
    }, []);

    /** 2️⃣ Marcar la siguiente palabra (y nivel) como completado */
    const completeWord = async (
        consonantId: string,
        totalWords: number
    ) => {
        const current = progress[consonantId] || {
            consonant: consonantId,
            word_index: 0,
            done: false,
        };
        const nextIndex = current.word_index + 1;
        const done = nextIndex >= totalWords;

        // upsert a user_progress (supabase-js v2)
        const { error } = await supabase
            .from("user_progress")
            .upsert({
                user_id: (await supabase.auth.getUser()).data.user!.id,
                consonant: consonantId,
                word_index: nextIndex,
                done,
            });
        if (error) throw error;

        setProgress((prev) => ({
            ...prev,
            [consonantId]: { consonant: consonantId, word_index: nextIndex, done },
        }));
    };

    /**
     * 3️⃣ Lógica de desbloqueo:
     *    - El idx=0 (primera consonante) siempre desbloqueada.
     *    - Cualquier idx>0 solo si la anterior .done === true.
     */
    const isUnlocked = (_cons: string, idx: number) => {
        if (idx === 0) return true;
        const prevCons = consonantList[idx - 1];
        return progress[prevCons]?.done === true;
    };

    return (
        <ProgressContext.Provider
            value={{ progress, isUnlocked, completeWord }}
        >
            {children}
        </ProgressContext.Provider>
    );
}
