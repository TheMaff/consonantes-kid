// src/context/ScoreContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

interface ScoreContextValue {
    score: number;
    addPoints: (points: number) => Promise<void>;
}

const ScoreContext = createContext<ScoreContextValue | undefined>(undefined);

export const useScore = () => {
    const ctx = useContext(ScoreContext);
    if (!ctx) throw new Error("useScore debe usarse dentro de <ScoreProvider>");
    return ctx;
};

export function ScoreProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [score, setScore] = useState(0);

    // 1. Cargar puntaje inicial
    useEffect(() => {
        if (!user) {
            setScore(0);
            return;
        }
        (async () => {
            try {
                const statRef = doc(db, "users", user.uid, "stats", "score");
                const snap = await getDoc(statRef);
                if (snap.exists()) {
                    setScore(snap.data().total || 0);
                }
            } catch (error) {
                console.error("Error cargando puntaje:", error);
            }
        })();
    }, [user]);

    // 2. Sumar puntos
    const addPoints = async (points: number) => {
        if (!user) return;
        const newScore = score + points;
        setScore(newScore); // Actualización optimista (UI rápida)

        try {
            const statRef = doc(db, "users", user.uid, "stats", "score");
            await setDoc(statRef, { total: newScore }, { merge: true });
        } catch (error) {
            console.error("Error guardando puntaje:", error);
            // Si falla en la nube, revertimos
            setScore(score);
        }
    };

    return (
        <ScoreContext.Provider value={{ score, addPoints }}>
            {children}
        </ScoreContext.Provider>
    );
}