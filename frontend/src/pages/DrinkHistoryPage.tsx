import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { drinkService, type DrinkEntry } from '../services/drinkService';
import { Calendar, Clock, Edit2, Trash2, Wine, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday, isBefore, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface CalendarDay {
  date: Date;
  drinks: DrinkEntry[];
  isCurrentMonth: boolean;
}

const DrinkHistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [drinks, setDrinks] = useState<DrinkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [editingDrink, setEditingDrink] = useState<DrinkEntry | null>(null);
  const [editForm, setEditForm] = useState({
    drinkName: '',
    notes: '',
    location: ''
  });

  // Rango de fechas: 3 meses atrás a 3 meses adelante
  const minDate = subMonths(new Date(), 3);
  const maxDate = addMonths(new Date(), 3);

  useEffect(() => {
    if (currentUser) {
      loadDrinks();
    }
  }, [currentUser]);

  const loadDrinks = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando bebidas para usuario:', currentUser?.id);
      const userDrinks = await drinkService.getUserDrinks(currentUser!.id);
      console.log('📊 Bebidas cargadas:', userDrinks.length);
      setDrinks(userDrinks);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      alert('Error al cargar el historial de bebidas');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDrink = async (drinkId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta bebida?')) {
      return;
    }

    try {
      await drinkService.deleteDrink(drinkId);
      await loadDrinks(); // Recargar la lista
      setSelectedDay(null); // Cerrar el detalle si estaba abierto
    } catch (error) {
      console.error('Error al eliminar bebida:', error);
      alert('Error al eliminar la bebida');
    }
  };

  const handleEditDrink = (drink: DrinkEntry) => {
    setEditingDrink(drink);
    setEditForm({
      drinkName: drink.drinkName,
      notes: drink.notes || '',
      location: drink.location || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingDrink) return;

    try {
      // Por ahora solo mostramos que se guardó, la funcionalidad completa se implementará después
      console.log('Guardando cambios:', editForm);
      alert('Funcionalidad de edición en desarrollo');
      setEditingDrink(null);
    } catch (error) {
      console.error('Error al editar bebida:', error);
      alert('Error al editar la bebida');
    }
  };

  const getCalendarDays = (): CalendarDay[] => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Obtener el primer día de la semana (lunes) y el último día de la semana
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // 1 = lunes
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return days.map(date => ({
      date,
      drinks: drinks.filter(drink => isSameDay(drink.timestamp, date)),
      isCurrentMonth: date >= monthStart && date <= monthEnd
    }));
  };

  const getDrinksForDay = (date: Date): DrinkEntry[] => {
    return drinks.filter(drink => isSameDay(drink.timestamp, date));
  };

  const formatTime = (timestamp: Date) => {
    return format(timestamp, 'HH:mm');
  };

  const canNavigateToMonth = (direction: 'prev' | 'next') => {
    const targetDate = direction === 'prev' 
      ? subMonths(currentDate, 1)
      : addMonths(currentDate, 1);
    
    return !isBefore(targetDate, minDate) && !isAfter(targetDate, maxDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (!canNavigateToMonth(direction)) return;
    
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
    setSelectedDay(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Wine className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  const calendarDays = getCalendarDays();
  const selectedDayDrinks = selectedDay ? getDrinksForDay(selectedDay) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-amber-600" />
              <h1 className="text-3xl font-bold text-gray-800">Historial de Bebidas</h1>
            </div>
            <Link 
              to="/add-drink"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Bebida
            </Link>
          </div>

          {/* Navegación del calendario */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              disabled={!canNavigateToMonth('prev')}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              disabled={!canNavigateToMonth('next')}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendario */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {calendarDays.map((calendarDay, index) => {
              const dayDrinks = calendarDay.drinks;
              const isSelected = selectedDay && isSameDay(calendarDay.date, selectedDay);
              const isCurrentDay = isToday(calendarDay.date);
              const isCurrentMonth = calendarDay.isCurrentMonth;
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDay(calendarDay.date)}
                  className={`
                    p-2 h-16 border rounded-lg text-sm transition-all relative
                    ${isSelected ? 'bg-amber-500 text-white border-amber-600' : 'hover:bg-gray-50 border-gray-200'}
                    ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
                    ${!isCurrentMonth ? 'text-gray-400' : ''}
                  `}
                >
                  <div className="font-medium">
                    {format(calendarDay.date, 'd')}
                  </div>
                  {dayDrinks.length > 0 && (
                    <div className={`
                      absolute bottom-1 right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold
                      ${isSelected ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'}
                    `}>
                      {dayDrinks.length}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Información del rango */}
          <div className="text-center text-sm text-gray-500">
            Mostrando desde {format(minDate, 'MMMM yyyy', { locale: es })} hasta {format(maxDate, 'MMMM yyyy', { locale: es })}
          </div>
        </div>

        {/* Detalle del día seleccionado */}
        {selectedDay && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
              {isToday(selectedDay) ? 'Hoy' : format(selectedDay, 'EEEE, d MMMM yyyy', { locale: es, weekStartsOn: 1 })}
            </h3>
            
            {selectedDayDrinks.length === 0 ? (
              <div className="text-center py-8">
                <Wine className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay bebidas registradas este día</p>
                <Link 
                  to={`/add-drink?date=${selectedDay.toISOString()}`}
                  className="inline-flex items-center gap-2 mt-3 text-amber-600 hover:text-amber-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Agregar bebida
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayDrinks.map((drink) => (
                  <div key={drink.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <img 
                        src={drink.image} 
                        alt={drink.drinkName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{drink.drinkName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(drink.timestamp)}
                          </span>
                          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                            {drink.category}
                          </span>
                          <span className="text-green-600 font-medium">
                            +{drink.xpReward} XP
                          </span>
                        </div>
                        {drink.notes && (
                          <p className="text-sm text-gray-500 mt-1">{drink.notes}</p>
                        )}
                        {drink.location && (
                          <p className="text-sm text-gray-500">{drink.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditDrink(drink)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar bebida"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDrink(drink.id!)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Eliminar bebida"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de edición */}
        {editingDrink && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Editar Bebida</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la bebida
                  </label>
                  <input
                    type="text"
                    value={editForm.drinkName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, drinkName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ej: Bar Central, Casa, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                    placeholder="Notas adicionales..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingDrink(null)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrinkHistoryPage;