// src/context/AuthContext.tsx

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

interface AuthCtx {
    session: Session | null;
    profile: {
        full_name: string;
        avatar_url: string;
    };
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<{
        full_name: string;
        avatar_url: string;
    }>({
        full_name: "",
        avatar_url: "",
    });

    useEffect(() => {
        // 1️⃣ Estado inicial
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            const user = data.session?.user;
            if (user) {
                setProfile({
                    full_name: user.user_metadata.full_name ?? "",
                    avatar_url: user.user_metadata.avatar_url ?? "",
                });
            }
        });

        // 2️⃣ Suscripción a cambios de auth
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, newSession) => {
            setSession(newSession);
            const user = newSession?.user;
            setProfile({
                full_name: user?.user_metadata.full_name ?? "",
                avatar_url: user?.user_metadata.avatar_url ?? "",
            });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // 3️⃣ Fuerza una recarga desde el servidor (útil tras actualizar metadata)
    const refreshProfile = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user) {
            setProfile({
                full_name: user.user_metadata.full_name ?? "",
                avatar_url: user.user_metadata.avatar_url ?? "",
            });
        }
    };

    return (
        <AuthContext.Provider value={{ session, profile, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}