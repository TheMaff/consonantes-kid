// src/context/ScoreContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

interface ScoreContextValue {
    score: number; // El puntaje total visible (Banco + Bolsillo)
    addPoints: (points: number) => void; // Suma al bolsillo
    commitPoints: () => Promise<void>; // Guarda el bolsillo en el banco (Firestore)
    discardPoints: () => void; // Vacía el bolsillo (Al salir o perder)
}

const ScoreContext = createContext<ScoreContextValue | undefined>(undefined);

export const useScore = () => {
    const ctx = useContext(ScoreContext);
    if (!ctx) throw new Error("useScore debe usarse dentro de <ScoreProvider>");
    return ctx;
};

export function ScoreProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [dbScore, setDbScore] = useState(0); // El Banco
    const [uncommitted, setUncommitted] = useState(0); // El Bolsillo

    // El puntaje que ve el usuario es la suma de ambos
    const score = dbScore + uncommitted;

    // 1. Cargar puntaje inicial del Banco
    useEffect(() => {
        if (!user) {
            setDbScore(0);
            return;
        }
        (async () => {
            try {
                const statRef = doc(db, "users", user.uid, "stats", "score");
                const snap = await getDoc(statRef);
                if (snap.exists()) {
                    setDbScore(snap.data().total || 0);
                }
            } catch (error) {
                console.error("Error cargando puntaje:", error);
            }
        })();
    }, [user]);

    // 2. Sumar puntos al Bolsillo (En vivo, sin internet)
    const addPoints = (points: number) => {
        setUncommitted((prev) => prev + points);
    };

    // 3. Transferir al Banco (Al terminar el nivel)
    const commitPoints = async () => {
        if (!user) return;
        const newTotal = dbScore + uncommitted;

        setDbScore(newTotal); // Actualizamos el banco local
        setUncommitted(0); // Vaciamos el bolsillo

        try {
            const statRef = doc(db, "users", user.uid, "stats", "score");
            await setDoc(statRef, { total: newTotal }, { merge: true });
        } catch (error) {
            console.error("Error guardando puntaje:", error);
        }
    };

    // 4. Perder los puntos del Bolsillo (Al salir con la X o perder vidas)
    const discardPoints = () => {
        setUncommitted(0);
    };

    return (
        <ScoreContext.Provider value={{ score, addPoints, commitPoints, discardPoints }}>
            {children}
        </ScoreContext.Provider>
    );
}