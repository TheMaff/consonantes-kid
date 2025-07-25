// src/context/AuthContext.tsx
import {
    createContext, useContext, useEffect, useState, type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";

interface AuthCtx {
    session: Session | null;
    loading: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export const useAuth = () => {
    const c = useContext(Ctx);
    if (!c) throw new Error("useAuth must be inside <AuthProvider>");
    return c;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // ① Obtiene la sesión que ya pudo haber quedado guardada
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session ?? null);
            setLoading(false);
        });

        // ② Se mantiene escuchando cambios (LOGIN, LOGOUT, REFRESH…)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, sess) => {
            setSession(sess);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <Ctx.Provider value={{ session, loading }}>
            {children}
        </Ctx.Provider>
    );
}
