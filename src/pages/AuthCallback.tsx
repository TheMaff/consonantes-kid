// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase }   from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession({
          storeSession: true,
      });

      if (error) {
        console.error("AuthCallback error", error);
        navigate("/login", { replace: true });
        return;
      }

      console.info("Sesión OK", data.session);
      navigate("/", { replace: true }); // a Home
    })();
  }, [navigate]);

  return <p style={{ textAlign: "center", marginTop: "4rem" }}>
           Verificando&nbsp;login…
         </p>;
}
