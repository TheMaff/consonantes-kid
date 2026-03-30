// src/context/BadgeContext.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

interface Badge {
    id: string; // En Firestore usaremos el levelId como ID del documento
    level_id: string;
    earned_at: string;
}

interface BadgeContextValue {
    badges: Badge[];
    loadBadges: () => Promise<void>;
    grantBadge: (levelId: string) => Promise<void>;
}

const BadgeContext = createContext<BadgeContextValue | undefined>(undefined);

export const useBadges = () => {
    const ctx = useContext(BadgeContext);
    if (!ctx) throw new Error("useBadges debe usarse dentro de <BadgeProvider>");
    return ctx;
};

export function BadgeProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [badges, setBadges] = useState<Badge[]>([]);

    const loadBadges = async () => {
        if (!user) {
            setBadges([]);
            return;
        }

        try {
            const badgesRef = collection(db, "users", user.uid, "badges");
            const snapshot = await getDocs(badgesRef);
            
            const loadedBadges: Badge[] = [];
            snapshot.forEach((docSnap) => {
                loadedBadges.push(docSnap.data() as Badge);
            });
            
            // Ordenamos por fecha de obtención (del más reciente al más antiguo)
            loadedBadges.sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime());
            
            setBadges(loadedBadges);
        } catch (error) {
            console.error("Error cargando medallas:", error);
        }
    };

    const grantBadge = async (levelId: string) => {
        if (!user) throw new Error("No hay usuario autenticado para otorgar la medalla");

        try {
            // Creamos la referencia al documento de la medalla. 
            // Usar levelId como ID del documento evita duplicados automáticamente en Firestore.
            const badgeRef = doc(db, "users", user.uid, "badges", levelId);
            
            const newBadge: Badge = {
                id: levelId,
                level_id: levelId,
                earned_at: new Date().toISOString()
            };

            // setDoc creará el documento o lo sobrescribirá (lo cual es seguro y evita errores de duplicación)
            await setDoc(badgeRef, newBadge);
            
            // Recargamos las medallas para actualizar la UI (tu Perfil)
            await loadBadges();
            
        } catch (error) {
            console.error("Error al otorgar medalla:", error);
            throw error;
        }
    };

    // Cargar medallas automáticamente cuando cambia el usuario
    useEffect(() => {
        loadBadges();
    }, [user]);

    return (
        <BadgeContext.Provider value={{ badges, loadBadges, grantBadge }}>
            {children}
        </BadgeContext.Provider>
    );
}