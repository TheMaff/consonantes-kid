// src/lib/firebase.ts
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Tipado estricto para las variables de entorno para evitar 'undefined' en runtime
interface FirebaseEnv {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

const getEnvVar = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Falta la variable de entorno crítica: ${key}`);
    }
    return value;
};

const firebaseConfig: FirebaseEnv = {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('VITE_FIREBASE_APP_ID')
};

// Inicialización de la infraestructura
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Opcional: Forzar el selector de cuentas de Google siempre
googleProvider.setCustomParameters({
    prompt: 'select_account'
});