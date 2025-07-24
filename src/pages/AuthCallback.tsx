import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function parseFragment(hash: string) {
    const params = new URLSearchParams(hash.replace("#", ""));
    return {
        access_token: params.get("access_token") ?? "",
        refresh_token: params.get("refresh_token") ?? "",
    };
}

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const { access_token, refresh_token } = parseFragment(
            window.location.hash,
        );

        if (!access_token || !refresh_token) {
            navigate("/login", { replace: true });
            return;
        }

        (async () => {
            const { error } = await supabase.auth.setSession({
                access_token,
                refresh_token,
            });

            if (error) {
                console.error("setSession error →", error);
                navigate("/login", { replace: true });
                return;
            }
            
            window.location.hash = "";
            navigate("/", { replace: true });
        })();
    }, [navigate]);

    return (
        <p style={{ textAlign: "center", marginTop: "4rem" }}>
            Verificando&nbsp;login…
        </p>
    );
}