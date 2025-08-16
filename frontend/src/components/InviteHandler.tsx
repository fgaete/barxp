import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { groupService } from '../services/groupService';
import { X, Users, CheckCircle, AlertCircle } from 'lucide-react';

const InviteHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    groupName?: string;
  } | null>(null);

  useEffect(() => {
    // Verificar si hay un código de invitación en la URL
    const urlParams = new URLSearchParams(location.search);
    const inviteParam = urlParams.get('invite');
    
    if (inviteParam && currentUser) {
      setInviteCode(inviteParam);
      setShowModal(true);
      // Limpiar la URL sin recargar la página
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location.search, currentUser]);

  const handleJoinGroup = async () => {
    if (!inviteCode || !currentUser) return;
    
    setIsProcessing(true);
    
    try {
      const groupId = await groupService.joinGroupByCode(inviteCode, currentUser);
      
      // Obtener información del grupo para mostrar el nombre
      const userGroups = await groupService.getUserGroups(currentUser.id);
      const joinedGroup = userGroups.find(g => g.id === groupId);
      
      setResult({
        success: true,
        message: '¡Te has unido al grupo exitosamente!',
        groupName: joinedGroup?.name || 'el grupo'
      });
      
      // Redirigir a la página de grupos después de 2 segundos
      setTimeout(() => {
        navigate('/groups');
        setShowModal(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error al unirse al grupo:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error al unirse al grupo'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setInviteCode(null);
    setResult(null);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {!result ? (
          // Modal de confirmación para unirse
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="w-6 h-6 mr-2 text-primary-500" />
                Invitación a Grupo
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                disabled={isProcessing}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Has sido invitado a un grupo!
              </h3>
              <p className="text-gray-600">
                Código de invitación: <span className="font-mono font-bold text-primary-600">{inviteCode}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                ¿Deseas unirte a este grupo de BarXP?
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button
                onClick={handleJoinGroup}
                className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Unirse al Grupo'
                )}
              </button>
            </div>
          </>
        ) : (
          // Modal de resultado
          <>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                result.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {result.success ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
              
              <h3 className={`text-lg font-semibold mb-2 ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.success ? '¡Éxito!' : 'Error'}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {result.message}
                {result.success && result.groupName && (
                  <span className="block mt-1 font-semibold text-primary-600">
                    Grupo: {result.groupName}
                  </span>
                )}
              </p>
              
              {result.success ? (
                <p className="text-sm text-gray-500">
                  Redirigiendo a la página de grupos...
                </p>
              ) : (
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InviteHandler;