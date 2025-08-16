import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Users, Plus, Trophy, Calendar, Crown, Star, UserPlus, X, Mail, Send, Trash2, UserMinus } from 'lucide-react';
import { calculateLevelInfo } from '../utils/levelSystem';
import { groupService, type UserGroup } from '../services/groupService';
import { emailService } from '../services/emailService';

const GroupsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadGroups();
    }
  }, [currentUser]);

  const loadGroups = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userGroups = await groupService.getUserGroups(currentUser.id);
      setGroups(userGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!currentUser || !newGroupName.trim()) return;

    try {
      setIsCreating(true);
      await groupService.createGroup({
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        isPrivate: false,
        owner: currentUser
      });
      
      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateModal(false);
      await loadGroups();
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendInvite = async () => {
    if (!currentUser || !inviteEmail.trim() || !selectedGroupId) return;

    try {
      setIsInviting(true);
      const selectedGroup = groups.find(g => g.id === selectedGroupId);
      if (!selectedGroup) return;

      await emailService.sendGroupInvitation({
        recipientEmail: inviteEmail.trim(),
        recipientName: inviteEmail.trim(),
        senderName: currentUser.displayName || currentUser.email,
        groupName: selectedGroup.name,
        inviteCode: selectedGroup.inviteCode,
        message: `Te invito a unirte a nuestro grupo ${selectedGroup.name}`,
        appUrl: window.location.origin
      });
      
      setInviteEmail('');
      setShowInviteModal(false);
      setSelectedGroupId(null);
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!currentUser || !groupToDelete) return;

    try {
      setIsDeleting(true);
      await groupService.deleteGroup(groupToDelete, currentUser.id);
      setShowDeleteConfirm(false);
      setGroupToDelete(null);
      await loadGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveMember = async (groupId: string, memberId: string, memberName: string) => {
    if (!currentUser) return;

    if (confirm(`¿Estás seguro de que quieres remover a ${memberName} del grupo?`)) {
      try {
        await groupService.removeMember(groupId, memberId, currentUser.id);
        await loadGroups();
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Grupos</h1>
            <p className="text-gray-600">Gestiona tus grupos y compite con amigos</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Grupo</span>
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Crea tu primer grupo!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Los grupos te permiten competir con amigos, compartir logros y motivarse mutuamente en su journey de aprendizaje.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-500 text-white px-8 py-4 rounded-xl hover:bg-primary-600 transition-colors flex items-center space-x-2 mx-auto shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Mi Primer Grupo</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group) => {
              const userMember = group.members.find(m => m.id === currentUser?.id);
              const isOwner = group.ownerId === currentUser?.id;
              
              return (
                <div key={group.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{group.name}</h3>
                      {isOwner && (
                        <Crown className="w-6 h-6 text-yellow-300" />
                      )}
                    </div>
                    <p className="text-primary-100 text-sm mb-4">{group.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{group.members.length} miembros</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4" />
                        <span>Nivel {calculateLevelInfo(userMember?.xp || 0).level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Top Miembros</h4>
                        {isOwner && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedGroupId(group.id);
                                setShowInviteModal(true);
                              }}
                              className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Invitar miembro"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setGroupToDelete(group.id);
                                setShowDeleteConfirm(true);
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar grupo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {group.members
                          .sort((a, b) => (b.xp || 0) - (a.xp || 0))
                          .slice(0, 3)
                          .map((member, index) => {
                            const levelInfo = calculateLevelInfo(member.xp || 0);
                            return (
                              <div key={member.id} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900">
                                      {member.name}
                                    </span>
                                    {member.isOwner && (
                                      <Crown className="w-4 h-4 text-yellow-500" />
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <span>Nivel {levelInfo.level}</span>
                                    <span>•</span>
                                    <span>{member.xp || 0} XP</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {index === 0 && (
                                    <Star className="w-5 h-5 text-yellow-500" />
                                  )}
                                  
                                  {/* Botón para remover miembro (solo para owners y no el owner mismo) */}
                                  {group.ownerId === currentUser?.id && !member.isOwner && (
                                    <button
                                      onClick={() => handleRemoveMember(group.id, member.id, member.name)}
                                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                      title={`Remover a ${member.name}`}
                                    >
                                      <UserMinus className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Creado {new Date(group.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Activo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal para crear grupo */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Crear Nuevo Grupo
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Grupo
                  </label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Los Cerveceros"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    rows={3}
                    placeholder="Describe tu grupo..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={isCreating}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || isCreating}
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? 'Creando...' : 'Crear Grupo'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para invitar miembro */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Invitar Miembro
                </h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email del invitado
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="amigo@ejemplo.com"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={isInviting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendInvite}
                  disabled={!inviteEmail.trim() || isInviting}
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isInviting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Invitación</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación para eliminar grupo */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Eliminar Grupo
                </h2>
                
                <p className="text-gray-600 mb-6">
                  ¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer y se eliminarán todos los datos del grupo.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setGroupToDelete(null);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteGroup}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Eliminar'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;