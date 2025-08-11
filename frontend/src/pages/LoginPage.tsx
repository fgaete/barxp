import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Beer, Trophy, Users, Star } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Aquí podrías mostrar un toast o mensaje de error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-blue-50 flex flex-col justify-center items-center p-6">
      {/* Logo y título */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <Beer className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-display font-bold text-gradient mb-3">
          BarXP
        </h1>
        
        <p className="text-gray-600 text-lg font-medium">
          Gamificación de Bebidas
        </p>
        
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
          Convierte cada trago en una aventura. Sube de nivel, desbloquea logros y compite con amigos.
        </p>
      </div>

      {/* Características destacadas */}
      <div className="grid grid-cols-2 gap-4 mb-12 max-w-sm">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">Sistema de Niveles</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">Grupos de Amigos</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">Logros Únicos</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
            <Beer className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">Catálogo Extenso</p>
        </div>
      </div>

      {/* Botón de inicio de sesión */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 animate-spin">
              <svg className="w-full h-full text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          
          <span className="font-medium text-gray-700">
            {isLoading ? 'Iniciando sesión...' : 'Continuar con Google'}
          </span>
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad. 
          BarXP promueve el consumo responsable.
        </p>
      </div>

      {/* Mensaje de responsabilidad */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-sm">
        <p className="text-xs text-yellow-800 text-center font-medium">
          🛡️ Recuerda: BarXP promueve el consumo responsable y la diversión segura. 
          Siempre bebe con moderación.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;