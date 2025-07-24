import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { consonantList } from "../data/consonants";

type Row = {
    consonant: string;
    word_index: number;
    done: boolean;
};

interface ProgressCtx {
    progress: Record<string, Row>;
    isUnlocked: (c: string, idx: number) => boolean;
    completeWord: (c: string, total: number) => Promise<void>;
}

const Ctx = createContext<ProgressCtx | null>(null);

export const useProgress = () => {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useProgress must be inside ProgressProvider");
    return ctx;
};

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [progress, setProgress] = useState<Record<string, Row>>({});

    /* ───── carga usuario + progreso ───── */
    useEffect(() => {
        let isMounted = true;
        (async () => {
            const { data: { user }, error: uErr } = await supabase.auth.getUser();
            if (uErr || !user) return;

            const { data, error } = await supabase
                .from("user_progress")
                .select("*")
                .eq("user_id", user.id);

            if (!isMounted) return;
            if (error) { console.error(error); return; }

            const map: Record<string, Row> = {};
            data?.forEach((row) => (map[row.consonant] = row as Row));
            setProgress(map);
        })();
        return () => { isMounted = false; };
    }, []);

    /* ───── helpers ───── */
    const isUnlocked = (_cons: string, idx: number) => {
        if (idx === 0) return true;
        const prev = consonantList[idx - 1];
        return progress[prev]?.done ?? false;
    };

    const completeWord = async (consonant: string, total: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const current = progress[consonant] ?? {
            user_id: user.id,
            consonant,
            word_index: 0,
            done: false,
        };

        const nextIndex = current.word_index + 1;
        const done = nextIndex === total;

        const { error } = await supabase
            .from("user_progress")
            .upsert({ ...current, word_index: nextIndex, done });

        if (error) { console.error(error); return; }

        setProgress((p) => ({
            ...p,
            [consonant]: { ...current, word_index: nextIndex, done },
        }));
    };

    return (
        <Ctx.Provider value={{ progress, isUnlocked, completeWord }}>
            {children}
        </Ctx.Provider>
    );
}
