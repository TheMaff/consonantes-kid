// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

// Interfaces estrictas
interface AuthContextType {
    session: any | null; // Mantenemos any temporalmente por compatibilidad con el resto de tu app
    user: User | null;   // Ahora usamos el User de Firebase
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    loading: boolean;
    error: Error | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Suscripción reactiva al estado de autenticación de Firebase
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        }, (err) => {
            setError(err);
            setLoading(false);
        });

        // Cleanup de la suscripción al desmontar
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            // Usamos Popup en lugar de Redirect. Es más rápido y evita crear componentes extra de Callback.
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error desconocido al iniciar sesión'));
        } finally {
            setLoading(false);
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            setLoading(true);
            await firebaseSignOut(auth);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error al cerrar sesión'));
        } finally {
            setLoading(false);
        }
    };

    // Disfrazamos (Mock) el objeto de Firebase para que coincida con la firma de Supabase
    // Así evitamos romper los componentes de UI que esperan 'user_metadata'
    const value = {
        session: user ? {
            user: {
                id: user.uid,
                email: user.email,
                user_metadata: {
                    avatar_url: user.photoURL || '', // <-- Añadimos fallback
                    full_name: user.displayName || 'Usuario', // <-- Añadimos fallback
                    name: user.displayName || 'Usuario' // <-- Añadimos fallback
                }
            }
        } : null,
        user,
        signInWithGoogle,
        signOut,
        loading,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};