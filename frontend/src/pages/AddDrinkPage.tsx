import React, { useState, useEffect } from 'react';
import { Search, Plus, Star, Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { drinkService } from '../services/drinkService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCustomDrink, setShowCustomDrink] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Leer fecha de los parámetros de URL
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const date = new Date(dateParam);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    }
  }, [searchParams]);
  
  // Categorías de bebidas con conteos actualizados
  const drinkCategories = [
    { id: 'all', name: 'Todos', count: 58 },
    { id: 'beer', name: 'Cervezas', count: 10 },
    { id: 'wine', name: 'Vinos', count: 8 },
    { id: 'cocktail', name: 'Cócteles', count: 39 },
    { id: 'whiskey', name: 'Whiskeys', count: 5 },
    { id: 'vodka', name: 'Vodkas', count: 3 },
    { id: 'rum', name: 'Rones', count: 2 },
    { id: 'other', name: 'Otros', count: 1 }
  ];

  // Lista de bebidas simplificada por categorías
  const popularDrinks: Drink[] = [
    // Cervezas
    { id: 1, name: 'Cerveza Lager', category: 'beer', alcoholContent: 4.5, xpReward: 15, difficulty: 'Fácil', image: '🍺', description: 'Cerveza rubia ligera y refrescante' },
    { id: 2, name: 'Cerveza Ale', category: 'beer', alcoholContent: 5.0, xpReward: 18, difficulty: 'Fácil', image: '🍺', description: 'Cerveza de fermentación alta' },
    { id: 3, name: 'Cerveza IPA', category: 'beer', alcoholContent: 6.0, xpReward: 25, difficulty: 'Medio', image: '🍺', description: 'Cerveza con mucho lúpulo' },
    { id: 4, name: 'Cerveza Stout', category: 'beer', alcoholContent: 5.5, xpReward: 22, difficulty: 'Medio', image: '🍺', description: 'Cerveza negra cremosa' },
    
    // Vinos
    { id: 5, name: 'Vino Tinto', category: 'wine', alcoholContent: 13.5, xpReward: 25, difficulty: 'Medio', image: '🍷', description: 'Vino tinto seco' },
    { id: 6, name: 'Vino Blanco', category: 'wine', alcoholContent: 12.5, xpReward: 25, difficulty: 'Medio', image: '🥂', description: 'Vino blanco fresco' },
    { id: 7, name: 'Vino Rosé', category: 'wine', alcoholContent: 12.0, xpReward: 22, difficulty: 'Fácil', image: '🌹', description: 'Vino rosado ligero' },
    { id: 8, name: 'Espumante', category: 'wine', alcoholContent: 12.0, xpReward: 30, difficulty: 'Medio', image: '🥂', description: 'Vino espumoso celebratorio' },
    
    // Licores destilados
    { id: 9, name: 'Ron', category: 'rum', alcoholContent: 40.0, xpReward: 30, difficulty: 'Medio', image: '🥃', description: 'Destilado de caña de azúcar' },
    { id: 10, name: 'Whiskey', category: 'whiskey', alcoholContent: 40.0, xpReward: 35, difficulty: 'Medio', image: '🥃', description: 'Destilado de cereales añejado' },
    { id: 11, name: 'Vodka', category: 'vodka', alcoholContent: 40.0, xpReward: 30, difficulty: 'Medio', image: '🍸', description: 'Destilado neutro cristalino' },
    { id: 12, name: 'Gin', category: 'gin', alcoholContent: 40.0, xpReward: 30, difficulty: 'Medio', image: '🍸', description: 'Destilado con enebro' },
     { id: 13, name: 'Tequila', category: 'tequila', alcoholContent: 40.0, xpReward: 35, difficulty: 'Medio', image: '🥃', description: 'Destilado mexicano de agave' },
     { id: 14, name: 'Pisco', category: 'pisco', alcoholContent: 40.0, xpReward: 35, difficulty: 'Medio', image: '🍾', description: 'Destilado de uva sudamericano' },
     { id: 15, name: 'Brandy', category: 'brandy', alcoholContent: 40.0, xpReward: 35, difficulty: 'Medio', image: '🥃', description: 'Destilado de frutas' },
     { id: 16, name: 'Cognac', category: 'cognac', alcoholContent: 40.0, xpReward: 45, difficulty: 'Difícil', image: '🥃', description: 'Brandy francés premium' },
    
    // Cócteles populares
    { id: 17, name: 'Pisco Sour', category: 'cocktail', alcoholContent: 20.0, xpReward: 40, difficulty: 'Medio', image: '🍸', description: 'Cóctel nacional de Chile y Perú' },
    { id: 18, name: 'Mojito', category: 'cocktail', alcoholContent: 15.0, xpReward: 35, difficulty: 'Medio', image: '🌿', description: 'Cóctel cubano refrescante' },
    { id: 19, name: 'Caipirinha', category: 'cocktail', alcoholContent: 18.0, xpReward: 30, difficulty: 'Fácil', image: '🍋', description: 'Cóctel brasileño con cachaça' },
    { id: 20, name: 'Margarita', category: 'cocktail', alcoholContent: 22.0, xpReward: 35, difficulty: 'Medio', image: '🍹', description: 'Cóctel mexicano con tequila' },
    { id: 21, name: 'Daiquiri', category: 'cocktail', alcoholContent: 20.0, xpReward: 40, difficulty: 'Medio', image: '🍹', description: 'Cóctel clásico con ron' },
    { id: 22, name: 'Piña Colada', category: 'cocktail', alcoholContent: 12.0, xpReward: 25, difficulty: 'Fácil', image: '🥥', description: 'Cóctel tropical cremoso' },
    { id: 23, name: 'Cosmopolitan', category: 'cocktail', alcoholContent: 18.0, xpReward: 45, difficulty: 'Difícil', image: '🍸', description: 'Cóctel elegante con vodka' },
    { id: 24, name: 'Gin Tonic', category: 'cocktail', alcoholContent: 15.0, xpReward: 25, difficulty: 'Fácil', image: '🍸', description: 'Cóctel clásico británico' },
    { id: 25, name: 'Whiskey Sour', category: 'cocktail', alcoholContent: 20.0, xpReward: 40, difficulty: 'Medio', image: '🥃', description: 'Cóctel ácido con whiskey' },
    { id: 26, name: 'Negroni', category: 'cocktail', alcoholContent: 24.0, xpReward: 45, difficulty: 'Difícil', image: '🍸', description: 'Cóctel italiano amargo' },
    { id: 27, name: 'Old Fashioned', category: 'cocktail', alcoholContent: 35.0, xpReward: 50, difficulty: 'Difícil', image: '🥃', description: 'Cóctel clásico americano' },
    { id: 28, name: 'Manhattan', category: 'cocktail', alcoholContent: 30.0, xpReward: 45, difficulty: 'Difícil', image: '🥃', description: 'Cóctel elegante con whiskey' },
    { id: 29, name: 'Aperol Spritz', category: 'cocktail', alcoholContent: 11.0, xpReward: 20, difficulty: 'Fácil', image: '🥂', description: 'Aperitivo italiano refrescante' },
    { id: 30, name: 'Bloody Mary', category: 'cocktail', alcoholContent: 15.0, xpReward: 30, difficulty: 'Medio', image: '🍅', description: 'Cóctel con vodka y tomate' },
    { id: 31, name: 'Espresso Martini', category: 'cocktail', alcoholContent: 20.0, xpReward: 40, difficulty: 'Difícil', image: '☕', description: 'Cóctel con café y vodka' },
    { id: 32, name: 'Tequila Sunrise', category: 'cocktail', alcoholContent: 18.0, xpReward: 30, difficulty: 'Medio', image: '🌅', description: 'Cóctel colorido mexicano' },
    { id: 33, name: 'Long Island', category: 'cocktail', alcoholContent: 28.0, xpReward: 60, difficulty: 'Difícil', image: '🍹', description: 'Cóctel fuerte con múltiples licores' },
    { id: 34, name: 'Sex on the Beach', category: 'cocktail', alcoholContent: 16.0, xpReward: 25, difficulty: 'Fácil', image: '🏖️', description: 'Cóctel tropical afrutado' },
    { id: 35, name: 'Blue Lagoon', category: 'cocktail', alcoholContent: 18.0, xpReward: 35, difficulty: 'Medio', image: '💙', description: 'Cóctel azul tropical' },
    { id: 36, name: 'Piscola', category: 'cocktail', alcoholContent: 12.0, xpReward: 20, difficulty: 'Fácil', image: '🥤', description: 'Pisco con Coca-Cola, muy popular en Chile' },
    { id: 37, name: 'Cuba Libre', category: 'cocktail', alcoholContent: 14.0, xpReward: 25, difficulty: 'Fácil', image: '🥤', description: 'Ron con Coca-Cola y limón' },
    { id: 38, name: 'Fernet con Cola', category: 'cocktail', alcoholContent: 18.0, xpReward: 25, difficulty: 'Fácil', image: '🥤', description: 'Fernet Branca con Coca-Cola' },
    { id: 39, name: 'Terremoto', category: 'cocktail', alcoholContent: 25.0, xpReward: 50, difficulty: 'Difícil', image: '🌋', description: 'Cóctel chileno tradicional' },
    { id: 40, name: 'Jote', category: 'cocktail', alcoholContent: 15.0, xpReward: 30, difficulty: 'Medio', image: '🍷', description: 'Vino tinto con Coca-Cola' },
    { id: 41, name: 'Borgoña', category: 'cocktail', alcoholContent: 16.0, xpReward: 35, difficulty: 'Medio', image: '🍓', description: 'Vino tinto con frutillas' },
    { id: 42, name: 'Clery', category: 'cocktail', alcoholContent: 14.0, xpReward: 25, difficulty: 'Fácil', image: '🍓', description: 'Vino blanco con frutillas' },
    { id: 43, name: 'Navegado', category: 'cocktail', alcoholContent: 20.0, xpReward: 40, difficulty: 'Medio', image: '🍊', description: 'Vino caliente especiado navideño' },
    
    // Licores adicionales por categoría
    { id: 44, name: 'Bourbon', category: 'whiskey', alcoholContent: 40.0, xpReward: 35, difficulty: 'Medio', image: '🥃', description: 'Whiskey americano' },
    { id: 45, name: 'Scotch', category: 'whiskey', alcoholContent: 40.0, xpReward: 40, difficulty: 'Difícil', image: '🥃', description: 'Whiskey escocés' },
    { id: 46, name: 'Irish Whiskey', category: 'whiskey', alcoholContent: 40.0, xpReward: 35, difficulty: 'Medio', image: '🥃', description: 'Whiskey irlandés' },
    { id: 47, name: 'Vodka Premium', category: 'vodka', alcoholContent: 40.0, xpReward: 35, difficulty: 'Medio', image: '🍸', description: 'Vodka de alta calidad' },
    { id: 48, name: 'Vodka Saborizada', category: 'vodka', alcoholContent: 37.5, xpReward: 30, difficulty: 'Fácil', image: '🍸', description: 'Vodka con sabores' },
    { id: 49, name: 'Ron Añejo', category: 'rum', alcoholContent: 40.0, xpReward: 40, difficulty: 'Difícil', image: '🥃', description: 'Ron envejecido premium' },
    { id: 50, name: 'Chicha', category: 'other', alcoholContent: 12.0, xpReward: 15, difficulty: 'Fácil', image: '🌽', description: 'Bebida fermentada tradicional' }
  ];

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

  const handleAddDrink = async (drink: typeof popularDrinks[0]) => {
    if (!currentUser || isAdding) return;
    
    console.log('🍺 Iniciando proceso de agregar bebida:', {
      userId: currentUser.id,
      drinkName: drink.name,
      userExists: !!currentUser
    });
    
    setIsAdding(true);
    try {
      console.log('📝 Llamando a drinkService.addDrink...');
      await drinkService.addDrink(currentUser.id, {
        drinkName: drink.name,
        category: drink.category,
        alcoholContent: drink.alcoholContent,
        xpReward: drink.xpReward,
        difficulty: drink.difficulty,
        image: drink.image,
        description: drink.description
      }, selectedDate || undefined);
      
      console.log('✅ Bebida agregada exitosamente');
      // Mostrar notificación de éxito y navegar de vuelta
      navigate('/', { state: { message: `¡+${drink.xpReward} XP! ${drink.name} agregado exitosamente` } });
    } catch (error) {
      console.error('❌ Error detallado al agregar bebida:', {
        error,
        message: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
        userId: currentUser.id,
        drinkName: drink.name
      });
      alert('Error al agregar la bebida. Inténtalo de nuevo.');
    } finally {
      setIsAdding(false);
    }
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
                {selectedDate ? (
                  <>Registra tu bebida para el {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}</>
                ) : (
                  'Registra tu bebida y gana XP'
                )}
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
                    disabled={isAdding}
                    className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{isAdding ? 'Agregando...' : 'Agregar a mi registro'}</span>
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
                      disabled={isAdding}
                      className="w-full bg-primary-100 text-primary-700 py-2 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding ? 'Agregando...' : 'Agregar'}
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