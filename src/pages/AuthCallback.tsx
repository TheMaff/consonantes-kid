// File: FrontEnd/consonantes-kid/src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Asegúrate de que esta ruta sea correcta

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Suscribirse a los cambios de estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // El evento 'SIGNED_IN' se dispara cuando la sesión se establece correctamente
      // después de una redirección de autenticación.
      if (event === 'SIGNED_IN' && session) {
        console.log("AuthCallback exitoso, sesión:", session);
        navigate("/", { replace: true }); // Redirigir a tu página de inicio/dashboard
      } else if (event === 'SIGNED_OUT') {
        // Si el usuario se desloguea o la sesión no es válida por alguna razón
        console.log("AuthCallback: Sesión cerrada o inválida.");
        navigate("/login", { replace: true }); // Redirigir a la página de inicio de sesión
      }
      // Otros eventos como 'INITIAL_SESSION', 'TOKEN_REFRESHED' también pueden ser manejados
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]); // Añadir navigate al array de dependencias

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem',
      color: '#333'
    }}>
      <p>Procesando autenticación, por favor espera...</p>
      {/* Puedes añadir un spinner de carga aquí para una mejor experiencia de usuario */}
    </div>
  );
}
