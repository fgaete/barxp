import React, { useState } from 'react';
import { Search, Plus, Star, Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Drink {
  id: number;
  name: string;
  category: string;
  alcoholContent: number;
  xpReward: number;
  difficulty: string;
  image: string;
  description: string;
}

const AddDrinkPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCustomDrink, setShowCustomDrink] = useState(false);
  
  // Usar datos reales - TODO: Obtener de la API
  const drinkCategories = [
    { id: 'all', name: 'Todos', count: 150 },
    { id: 'beer', name: 'Cerveza', count: 45 },
    { id: 'wine', name: 'Vino', count: 30 },
    { id: 'cocktail', name: 'Cóctel', count: 25 },
    { id: 'whiskey', name: 'Whiskey', count: 20 },
    { id: 'vodka', name: 'Vodka', count: 15 },
    { id: 'rum', name: 'Ron', count: 15 }
  ]; // TODO: Obtener categorías desde la API

  const popularDrinks: Drink[] = []; // TODO: Obtener bebidas populares desde la API

  const filteredDrinks = popularDrinks.filter(drink => {
    const matchesSearch = drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drink.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           drink.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-700';
      case 'Medio': return 'bg-yellow-100 text-yellow-700';
      case 'Difícil': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddDrink = (drink: typeof popularDrinks[0]) => {
    // Aquí se haría la llamada a la API para registrar el trago
    console.log('Agregando trago:', drink);
    // Mostrar notificación de éxito y navegar de vuelta
    navigate('/', { state: { message: `¡+${drink.xpReward} XP! ${drink.name} agregado` } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Agregar Trago
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Registra tu bebida y gana XP
              </p>
            </div>
            
            <button
              onClick={() => setShowCustomDrink(true)}
              className="bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Personalizado
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar bebidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filtros de categoría */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {drinkCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Lista de bebidas */}
        <div className="space-y-3">
          {popularDrinks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay bebidas disponibles
              </h3>
              <p className="text-gray-600 mb-6">
                Aún no hay bebidas en el catálogo. Puedes crear una bebida personalizada.
              </p>
              <button
                onClick={() => setShowCustomDrink(true)}
                className="btn-primary"
              >
                Crear Bebida Personalizada
              </button>
            </div>
          ) : filteredDrinks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron bebidas
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta con otros términos de búsqueda
              </p>
              <button
                onClick={() => setShowCustomDrink(true)}
                className="btn-primary"
              >
                Crear Bebida Personalizada
              </button>
            </div>
          ) : (
            filteredDrinks.map((drink) => (
              <div key={drink.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{drink.image}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {drink.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {drink.description}
                        </p>
                        
                        <div className="flex items-center space-x-3 text-sm">
                          <span className="text-gray-600">
                            {drink.category}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">
                            {drink.alcoholContent}% alcohol
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drink.difficulty)}`}>
                            {drink.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-primary-600 font-bold text-lg mb-1">
                          <Trophy className="w-5 h-5" />
                          <span>+{drink.xpReward}</span>
                        </div>
                        <p className="text-gray-500 text-xs">XP</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleAddDrink(drink)}
                    className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Agregar a mi registro</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bebidas populares */}
        {searchTerm === '' && selectedCategory === 'all' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Más Populares
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {popularDrinks.slice(0, 4).map((drink) => (
                <div key={`popular-${drink.id}`} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl mb-2">{drink.image}</div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {drink.name}
                    </h4>
                    <div className="flex items-center justify-center space-x-1 text-primary-600 text-sm font-medium mb-2">
                      <Trophy className="w-4 h-4" />
                      <span>+{drink.xpReward}</span>
                    </div>
                    <button
                      onClick={() => handleAddDrink(drink)}
                      className="w-full bg-primary-100 text-primary-700 py-2 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal para bebida personalizada */}
      {showCustomDrink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Crear Bebida Personalizada
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Bebida
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: Mi Cóctel Especial"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Seleccionar categoría</option>
                  <option value="beer">Cerveza</option>
                  <option value="wine">Vino</option>
                  <option value="cocktail">Cóctel</option>
                  <option value="whiskey">Whiskey</option>
                  <option value="vodka">Vodka</option>
                  <option value="rum">Ron</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido Alcohólico (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: 12.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe tu bebida..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCustomDrink(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí se procesaría la bebida personalizada
                  setShowCustomDrink(false);
                }}
                className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                Crear y Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDrinkPage;