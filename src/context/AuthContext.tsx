// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { type Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthCtx {
    session: Session | null;
    signIn: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);
export const useAuth = () => useContext(Ctx)!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((_, sess) => {
            setSession(sess);
        });
        supabase.auth.getSession().then(({ data }) => setSession(data.session));
        return () => data.subscription.unsubscribe();
    }, []);

    const signIn = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) alert(error.message);
        else alert("¡Revisa tu correo para el enlace mágico!");
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    }

    return (
        <Ctx.Provider value={{ session, signIn, signOut }}>
            {children}
        </Ctx.Provider>
    );
}
