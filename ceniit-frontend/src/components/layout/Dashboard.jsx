import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DashboardOverview } from '../dashboard/DashboardOverview';
import { ResourceList } from '../resources/ResourceList';
import { ReservationList } from '../reservations/ReservationList';
import { ProjectList } from '../projects/ProjectList';
import { UserList } from '../users/UserList';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const getSectionTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      resources: 'Gestión de Recursos',
      reservations: 'Gestión de Reservas',
      projects: 'Gestión de Proyectos',
      users: 'Gestión de Usuarios',
      reports: 'Reportes',
      maintenance: 'Mantenimiento'
    };
    return titles[activeSection] || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'resources':
        return <ResourceList />;
      case 'reservations':
        return <ReservationList />;
      case 'projects':
        return <ProjectList />;
      case 'users':
        return <UserList />;
      case 'reports':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Módulo de Reportes en desarrollo</p>
            </div>
          </div>
        );
      case 'maintenance':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Módulo de Mantenimiento en desarrollo</p>
            </div>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        user={user}
        onLogout={logout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getSectionTitle()} />
        
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};