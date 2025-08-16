import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Configuración del nuevo proyecto barxp-app
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyChtPGH7VWWkSHt6vpRCH0aMTDyFLN8P-k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "barxp-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "barxp-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "barxp-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "478955023319",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:478955023319:web:3319fe7d77eaf14afdb992"
};

// Verificar si estamos usando credenciales por defecto
if (firebaseConfig.apiKey === "AIzaSyChtPGH7VWWkSHt6vpRCH0aMTDyFLN8P-k") {
  console.info('🔥 Usando configuración Firebase del nuevo proyecto barxp-app');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Configuración adicional para manejo de errores
try {
  // Habilitar red explícitamente para evitar errores de conexión
  enableNetwork(db).catch((error) => {
    console.warn('⚠️ Error al habilitar red de Firestore:', error);
  });
} catch (error) {
  console.error('❌ Error al configurar Firestore:', error);
}

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;