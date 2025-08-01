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
    id: string;       // uuid de la tabla
    level_id: string; // ej. "M"
    earned_at: string;
}

interface BadgeContextValue {
    badges: Badge[];
    loadBadges: () => Promise<void>;
    grantBadge: (levelId: string) => Promise<void>;
}

const BadgeCtx = createContext<BadgeContextValue | undefined>(undefined);

export const useBadges = () => {
    const ctx = useContext(BadgeCtx);
    if (!ctx) throw new Error("useBadges debe usarse dentro de <BadgeProvider>");
    return ctx;
};

export function BadgeProvider({ children }: { children: ReactNode }) {
    const [badges, setBadges] = useState<Badge[]>([]);

    const loadBadges = async () => {
        // 1️⃣ Obtenemos el user_id de la sesión
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // 2️⃣ Cargamos sólo id, level_id y earned_at
        const { data: rows, error } = await supabase
            .from("user_badges")
            .select("id, level_id, earned_at")
            .eq("user_id", user.id)
            .order("earned_at", { ascending: false });

        if (error) throw error;

        setBadges(
            rows.map((r) => ({
                id: r.id,
                level_id: r.level_id,
                earned_at: r.earned_at,
            }))
        );
    };

    const grantBadge = async (levelId: string) => {
        // obtenemos user_id
        const {
            data: { user },
            error: userErr,
        } = await supabase.auth.getUser();
        if (userErr || !user) throw userErr || new Error("No user");
        // insertamos
        const { error } = await supabase.from("user_badges").insert({
            user_id: user.id,
            level_id: levelId,
        });
        if (error) throw error;
        await loadBadges();
    };

    useEffect(() => {
        loadBadges().catch(console.error);
    }, []);

    return (
        <BadgeCtx.Provider value={{ badges, loadBadges, grantBadge }}>
            {children}
        </BadgeCtx.Provider>
    );
}
