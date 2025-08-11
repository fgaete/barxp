import { createContext } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '../types';

export interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);