import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Configuración temporal para desarrollo - reemplazar con credenciales reales
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBvOkBwNzEDDJ4XNxbL5Qo5YjKl8mNoPqR",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "barxp-dev-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "barxp-dev-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "barxp-dev-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "987654321",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:987654321:web:abcdef987654321"
};

// Verificar si estamos en modo desarrollo con credenciales demo
if (firebaseConfig.apiKey === "AIzaSyBvOkBwNzEDDJ4XNxbL5Qo5YjKl8mNoPqR") {
  console.warn('⚠️ Usando credenciales Firebase de desarrollo. Para autenticación real, configura las variables de entorno en .env.local');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;