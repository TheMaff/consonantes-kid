// src/context/ProgressContext.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext"; // Importamos tu adaptador de sesión
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
    completeWord: (consonantId: string, totalWords: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressCtx | undefined>(undefined);

export const useProgress = () => {
    const ctx = useContext(ProgressContext);
    if (!ctx) throw new Error("useProgress debe usarse dentro de <ProgressProvider>");
    return ctx;
};

export function ProgressProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth(); // Extraemos el usuario actual
    const [progress, setProgress] = useState<ProgressState>({});

    /** 1️⃣ Carga inicial desde Firestore */
    useEffect(() => {
        // Si no hay usuario, limpiamos el progreso (ej: al cerrar sesión)
        if (!user) {
            setProgress({});
            return;
        }

        (async () => {
            try {
                // Buscamos en la subcolección privada del usuario
                const progressRef = collection(db, "users", user.uid, "progress");
                const snapshot = await getDocs(progressRef);

                const map: ProgressState = {};
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data() as ProgressRow;
                    map[data.consonant] = data;
                });

                setProgress(map);
            } catch (error) {
                console.error("Error cargando progreso de Firestore:", error);
            }
        })();
    }, [user]); // Se vuelve a ejecutar si cambia el usuario

    /** 2️⃣ Marcar la siguiente palabra (y nivel) como completado */
    const completeWord = async (consonantId: string, totalWords: number) => {
        if (!user) throw new Error("Debes iniciar sesión para guardar progreso");

        const current = progress[consonantId] || {
            consonant: consonantId,
            word_index: 0,
            done: false,
        };

        const nextIndex = current.word_index + 1;
        const done = nextIndex >= totalWords;

        const newProgressData: ProgressRow = {
            consonant: consonantId,
            word_index: nextIndex,
            done,
        };

        try {
            // Guardamos en Firestore usando setDoc con merge (el equivalente a 'upsert')
            const docRef = doc(db, "users", user.uid, "progress", consonantId);
            await setDoc(docRef, newProgressData, { merge: true });

            // Actualizamos la UI inmediatamente
            setProgress((prev) => ({
                ...prev,
                [consonantId]: newProgressData,
            }));
        } catch (error) {
            console.error("Error guardando progreso:", error);
            throw error;
        }
    };

    /** 3️⃣ Lógica de desbloqueo (Intacta) */
    const isUnlocked = (_cons: string, idx: number) => {
        if (idx === 0) return true;
        const prevCons = consonantList[idx - 1];
        return progress[prevCons]?.done === true;
    };

    return (
        <ProgressContext.Provider value={{ progress, isUnlocked, completeWord }}>
            {children}
        </ProgressContext.Provider>
    );
}