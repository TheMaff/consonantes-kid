import { supabase } from "../lib/supabase";

export async function signInWithEmail(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // emailRedirectTo: import.meta.env.VITE_REDIRECT,
            shouldCreateUser: true,
            emailRedirectTo: `${window.location.origin}/auth/callback`
        },
    });
    return error;
}
