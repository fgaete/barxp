import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Plus, User, Trophy } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navItems = [
    {
      to: '/',
      icon: Home,
      label: 'Inicio'
    },
    {
      to: '/groups',
      icon: Users,
      label: 'Grupos'
    },
    {
      to: '/add-drink',
      icon: Plus,
      label: 'Agregar',
      isSpecial: true
    },
    {
      to: '/achievements',
      icon: Trophy,
      label: 'Logros'
    },
    {
      to: '/profile',
      icon: User,
      label: 'Perfil'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          
          if (item.isSpecial) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center p-2"
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-600 scale-110' 
                        : 'bg-primary-500 hover:bg-primary-600 hover:scale-105'
                    }`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xs mt-1 font-medium transition-colors ${
                      isActive ? 'text-primary-600' : 'text-gray-600'
                    }`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          }
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center p-2 min-w-[60px]"
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-primary-100' : 'hover:bg-gray-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-primary-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className={`text-xs mt-1 font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;