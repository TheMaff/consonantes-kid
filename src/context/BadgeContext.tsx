// src/context/BadgeContext.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";

interface Badge {
    id: string;
    level_id: string;
    earned_at: string;
}

interface BadgeContextValue {
    badges: Badge[];
    loadBadges: () => Promise<void>;
    grantBadge: (levelId: string) => Promise<void>;
}

const BadgeContext = createContext<BadgeContextValue | undefined>(undefined);

export const useBadges = () => {
    const ctx = useContext(BadgeContext);
    if (!ctx) throw new Error("useBadges debe usarse dentro de <BadgeProvider>");
    return ctx;
};

export function BadgeProvider({ children }: { children: ReactNode }) {
    const [badges, setBadges] = useState<Badge[]>([]);

    const loadBadges = async () => {
        const userResp = await supabase.auth.getUser();
        const user = userResp.data.user;
        if (!user) return;

        const { data: rows, error } = await supabase
            .from("user_badges")
            .select("id, level_id, earned_at")
            .eq("user_id", user.id)
            .order("earned_at", { ascending: false });

        if (error) throw error;

        setBadges(
            (rows || []).map((r: any) => ({
                id: r.id,
                level_id: r.level_id,
                earned_at: r.earned_at,
            }))
        );
    };

    const grantBadge = async (levelId: string) => {
        const userResp = await supabase.auth.getUser();
        const user = userResp.data.user;
        if (!user) throw new Error("No hay usuario autenticado");

        // 1️⃣ Comprobar existencia previa
        const { data: existing, error: fetchErr } = await supabase
            .from("user_badges")
            .select("id")
            .eq("user_id", user.id)
            .eq("level_id", levelId);

        if (fetchErr) throw fetchErr;
        if (existing && existing.length > 0) {
            // Ya tiene la medalla: no insertar de nuevo
            return;
        }

        // 2️⃣ Insertar la nueva medalla
        const { error: insertErr } = await supabase.from("user_badges").insert({
            user_id: user.id,
            level_id: levelId,
        });

        // Si el constraint UNIQUE se disparara igual, captura el error y sigue sin duplicar
        if (insertErr && insertErr.code === "23505") {
            // duplicate key
            console.warn("Medalla ya existe, duplicado ignorado");
        } else if (insertErr) {
            throw insertErr;
        }

        // 3️⃣ Recargar medallas para actualizar UI
        await loadBadges();
    };

    useEffect(() => {
        loadBadges().catch(console.error);
    }, []);

    return (
        <BadgeContext.Provider value={{ badges, loadBadges, grantBadge }}>
            {children}
        </BadgeContext.Provider>
    );
}
