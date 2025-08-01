// src/context/AuthContext.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface Profile {
    full_name: string;
    avatar_url: string;
}

interface AuthCtx {
    session: Session | null;
    profile: Profile | null;
}

const AuthCtx = createContext<AuthCtx | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    // Cada vez que cambia la sesión
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            if (data.session) fetchProfile(data.session.user.id);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_evt, newSession) => {
            setSession(newSession);
            if (newSession) fetchProfile(newSession.user.id);
            else setProfile(null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        // Supón que guardas tu perfil en la tabla "kids" vinculada a auth.users.id
        const { data, error } = await supabase
            .from("kids")
            .select("alias, avatar_url")
            .eq("parent_uid", userId)
            .single();
        if (!error && data) {
            setProfile({ full_name: data.alias, avatar_url: data.avatar_url });
        }
    };

    return (
        <AuthCtx.Provider value={{ session, profile }}>
            {children}
        </AuthCtx.Provider>
    );
}
