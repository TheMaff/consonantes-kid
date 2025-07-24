// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const { error } = await supabase.auth.exchangeCodeForSession( );
            if (error) {
                console.error(error);
                navigate("/login", { replace: true });
                return;
            }
            navigate("/", { replace: true });          // Home
        })();
    }, [navigate]);

    return <p style={{ textAlign: "center", marginTop: "4rem" }}>Verificando login…</p>;
}
