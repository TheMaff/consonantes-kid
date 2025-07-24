
// File: FrontEnd/consonantes-kid/src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

    useEffect(() => {
        console.log( "AuthCallback mounted");
        // 0️⃣  Si no hay hash, redirige a login
        if (!window.location.hash) {
            console.log( "No hash found, redirecting to login");
            
            navigate("/login", { replace: true });
            return;
        }

        (async () => {
            // 1️⃣  Lee el hash #access_token=&refresh_token=...
            const hash = window.location.hash.startsWith("#")
                ? window.location.hash.substring(1)           // quita ‘#’
                : window.location.hash;

            const params = new URLSearchParams(hash);
            const access_token = params.get("access_token");
            const refresh_token = params.get("refresh_token");
            console.log("hash", hash);
            

            // 2️⃣  Si ambos existen los guardamos manualmente
            if (access_token && refresh_token) {
                console.log("tokens", { access_token, refresh_token });
                
                const { error } = await supabase.auth.setSession({
                    access_token,
                    refresh_token,
                });
                if (error) {
                    console.error("setSession error", error);
                    navigate("/login", { replace: true });
                    return;
                }
            }

            // 3️⃣  Si por alguna razón los tokens ya fueron
            //     persistidos por el SDK, `getSession()` nos los dará.
            const {
                data: { session },
            } = await supabase.auth.getSession();

            // 4️⃣  Redirige según tengamos o no sesión.
            navigate(session ? "/" : "/login", { replace: true });
        })();
    }, [navigate]);

    return <p style={{ textAlign: "center", marginTop: "4rem" }}>Verificando login…</p>;
}