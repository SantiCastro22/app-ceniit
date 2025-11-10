import React from 'react';
import { 
  BarChart3, 
  Package, 
  Calendar, 
  FileText, 
  Users, 
  Download, 
  Wrench,
  User,
  LogOut
} from 'lucide-react';

export const Sidebar = ({ activeSection, setActiveSection, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, roles: ['admin', 'user'] },
    { id: 'resources', name: 'Recursos', icon: Package, roles: ['admin', 'user'] },
    { id: 'reservations', name: 'Reservas', icon: Calendar, roles: ['admin', 'user'] },
    { id: 'projects', name: 'Proyectos', icon: FileText, roles: ['admin', 'user'] },
    { id: 'users', name: 'Usuarios', icon: Users, roles: ['admin'] },
    { id: 'reports', name: 'Reportes', icon: Download, roles: ['admin'] },
    // { id: 'maintenance', name: 'Mantenimiento', icon: Wrench, roles: ['admin'] }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-screen">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">CENIIT</h2>
        <p className="text-sm text-gray-600">Sistema de Gestión</p>
      </div>
      
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t bg-white">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
            <p className="text-xs text-gray-500">
              {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </p>
          </div>
          <button 
            onClick={onLogout}
            className="ml-auto hover:bg-red-50 p-1 rounded"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5 text-gray-400 hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};