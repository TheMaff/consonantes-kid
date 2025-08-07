// src/context/LivesContext.tsx
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

interface LivesContextValue {
    lives: number;
    loseLife: () => void;
    resetLives: () => void;
}

const LivesContext = createContext<LivesContextValue | undefined>(undefined);

export const useLives = () => {
    const ctx = useContext(LivesContext);
    if (!ctx) throw new Error("useLives debe usarse dentro de <LivesProvider>");
    return ctx;
};

export function LivesProvider({ children }: { children: ReactNode }) {
    const [lives, setLives] = useState(4);

    const loseLife = () => {
        setLives((prev) => Math.max(prev - 1, 0));
    };

    const resetLives = () => {
        setLives(4);
    };

    return (
        <LivesContext.Provider value={{ lives, loseLife, resetLives }}>
            {children}
        </LivesContext.Provider>
    );
}
