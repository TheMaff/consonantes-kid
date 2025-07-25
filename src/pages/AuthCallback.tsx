import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            // 1. Tomamos el fragmento #access_token=…&refresh_token=…
            const params = new URLSearchParams(window.location.hash.slice(1));
            const access_token = params.get("access_token");
            const refresh_token = params.get("refresh_token");

            if (access_token && refresh_token) {
                const { error } = await supabase.auth.setSession({
                    access_token,
                    refresh_token,
                });
                if (error) {
                    console.error("[AuthCallback] setSession error:", error);
                    navigate("/login", { replace: true });
                    return;
                }
            }

            // 2.  Redirigimos: si la sesión existe AuthProvider lo sabrá
            navigate("/", { replace: true });
        })();
    }, [navigate]);

    return (
        <p style={{ textAlign: "center", marginTop: "4rem" }}>
            Verificando sesión…
        </p>
    );
}
