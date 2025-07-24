// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            // ① procesa access_token, refresh_token, etc.
            const { error } = await (supabase.auth as any).getSessionFromUrl({
                storeSession: true,
            });

            if (error) {
                console.error("AuthCallback error", error);
                navigate("/login", { replace: true });
                return;
            }

            // ② a Home
            navigate("/", { replace: true });
        })();
    }, [navigate]);

    return (
        <p style={{ textAlign: "center", marginTop: "4rem" }}>
            Verificando&nbsp;login…
        </p>
    );
}
