import React, { useState, useEffect } from 'react';
import { Package, FileText, Calendar, Wrench, CheckCircle, Clock } from 'lucide-react';
import { resourceService } from '../../services/resourceService';
import { reservationService } from '../../services/reservationService';
import { projectService } from '../../services/projectService';

export const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    activeProjects: 0,
    pendingReservations: 0,
    inMaintenance: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [resources, reservations, projects] = await Promise.all([
        resourceService.getAll(),
        reservationService.getAll(),
        projectService.getAll()
      ]);

      setStats({
        totalResources: resources.length,
        activeProjects: projects.filter(p => p.status === 'activo').length,
        pendingReservations: reservations.filter(r => r.status === 'pendiente').length,
        inMaintenance: resources.filter(r => r.status === 'mantenimiento').length
      });

      setRecentReservations(reservations.slice(0, 5));
      setRecentProjects(projects.filter(p => p.status === 'activo').slice(0, 5));
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Recursos Totales', value: stats.totalResources, icon: Package, color: 'blue' },
    { title: 'Proyectos Activos', value: stats.activeProjects, icon: FileText, color: 'green' },
    { title: 'Reservas Pendientes', value: stats.pendingReservations, icon: Clock, color: 'yellow' },
    { title: 'En Mantenimiento', value: stats.inMaintenance, icon: Wrench, color: 'red' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard CENIIT</h1>
        <p className="text-gray-600">Sistema de Gestión de Equipamiento, Recursos y Proyectos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 text-${stat.color}-500`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Reservas Recientes</h3>
          </div>
          <div className="p-6">
            {recentReservations.length > 0 ? (
              <div className="space-y-4">
                {recentReservations.map(reservation => (
                  <div key={reservation.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{reservation.resource_name}</p>
                      <p className="text-sm text-gray-500">
                        {reservation.date} - {reservation.start_time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      reservation.status === 'confirmada' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay reservas recientes</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Proyectos Activos</h3>
          </div>
          <div className="p-6">
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map(project => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">
                        {project.resource_count || 0} recursos asignados
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {project.progress || 0}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay proyectos activos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};