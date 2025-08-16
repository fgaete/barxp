import React, { useEffect, useState } from 'react';
import { 
  type User as FirebaseUser,
  type AuthError,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase.ts';
import type { User } from '../types';
import { AuthContext, type AuthContextType } from './auth';
import { drinkService } from '../services/drinkService';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    try {
      console.log('🔄 Iniciando autenticación con Google...');
      console.log('📋 Configuración Firebase:', {
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('✅ Autenticación exitosa:', user.email);
      // Crear o actualizar usuario en nuestra base de datos
      await createOrUpdateUser(user);
    } catch (error) {
      const authError = error as AuthError;
      console.error('❌ Error en autenticación con Google:', authError);
      
      // Mostrar errores específicos más claros
      if (authError.code === 'auth/popup-closed-by-user') {
        console.log('ℹ️ Usuario cerró el popup de autenticación');
        alert('Autenticación cancelada. Por favor, intenta nuevamente.');
      } else if (authError.code === 'auth/popup-blocked') {
        console.error('🚫 Popup bloqueado por el navegador');
        alert('El popup fue bloqueado. Por favor, permite popups para este sitio.');
      } else if (authError.code === 'auth/configuration-not-found') {
        console.error('⚙️ Configuración Firebase inválida - usando credenciales demo');
        alert('Error de configuración. Verifica las credenciales de Firebase.');
      } else if (authError.code === 'auth/unauthorized-domain') {
        console.error('🚫 Dominio no autorizado:', window.location.origin);
        alert(`Dominio no autorizado: ${window.location.origin}. Verifica la configuración en Firebase Console.`);
      } else if (authError.code === 'auth/operation-not-allowed') {
        console.error('🚫 Operación no permitida - Google Auth no está habilitado correctamente');
        alert('Error: Google Authentication no está habilitado en Firebase Console. Por favor, habilita Google como proveedor de autenticación.');
      } else {
        console.error('🔥 Error Firebase:', authError.code, authError.message);
        alert(`Error de autenticación: ${authError.message}`);
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const createOrUpdateUser = async (firebaseUser: FirebaseUser) => {
    try {
      // Crear un usuario nuevo con valores iniciales reales
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Usuario',
        photoURL: firebaseUser.photoURL || undefined,
        level: 1, // Nivel inicial
        currentXP: 0, // XP inicial
        totalXP: 0, // XP total inicial
        xpToNextLevel: 100, // XP necesario para nivel 2
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'es',
          units: 'metric'
        }
      };
      
      // Inicializar usuario en Firestore
      await drinkService.initializeUser(newUser);
      
      setCurrentUser(newUser);
    } catch (error) {
      console.error('Error al crear/actualizar usuario:', error);
      // Aún así establecer el usuario local para que la app funcione
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Usuario',
        photoURL: firebaseUser.photoURL || undefined,
        level: 1,
        currentXP: 0,
        totalXP: 0,
        xpToNextLevel: 100,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'es',
          units: 'metric'
        }
      };
      setCurrentUser(newUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        await createOrUpdateUser(firebaseUser);
      } else {
        setFirebaseUser(null);
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}