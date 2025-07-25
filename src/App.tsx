// src/App.tsx
import type { Session } from "@supabase/supabase-js";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
// import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Level from "./pages/Level";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import { useEffect, useState } from "react";


export default function App() {

  const [session, setSession] = useState<Session | null>(null);
  // const { session } = useAuth();

  // ① carga inicial
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // ② cambios posteriores
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) =>
      setSession(newSession)
      );
    console.log("[App] onAuthStateChange subscription:", subscription);

    return () => subscription.unsubscribe();
  }, []);

  console.log("[App] session:", session);

  return (
    <Routes>
      {/* ruta pública */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* rutas privadas */}
      {session ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/level/:consonant/:word" element={<Level />} />
          <Route path="*" element={<Home />} />
        </>
      ) : (
        /* si NO hay sesión, todo te manda al login */
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}
