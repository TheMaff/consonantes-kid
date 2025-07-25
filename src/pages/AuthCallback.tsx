import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // 1️⃣ – no hash  ->  back to /login
        if (!window.location.hash) {
            navigate("/login", { replace: true });
            return;
        }

        // 2️⃣ – parse tokens del fragmento
        (async () => {
            const params = new URLSearchParams(window.location.hash.substring(1));
            const access_token = params.get("access_token");
            const refresh_token = params.get("refresh_token");

            if (access_token && refresh_token) {
                const { error } = await supabase.auth.setSession({ access_token, refresh_token });
                if (error) {
                    console.error("[AuthCallback] setSession error:", error);
                    navigate("/login", { replace: true });
                    return;
                }
            }

            // 3️⃣ – esperar a que el cliente emita el evento de sesión lista
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event) => {
                    if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
                        subscription.unsubscribe();          // 👉 sólo una vez
                        navigate("/", { replace: true });    // a la Home
                    }
                }
            );
        })();
    }, [navigate]);

    return (
        <p style={{ textAlign: "center", marginTop: "4rem" }}>
            Verificando sesión…
        </p>
    );
}
