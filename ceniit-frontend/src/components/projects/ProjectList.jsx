import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { projectService } from '../../services/projectService';

export const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error cargando proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando proyectos...</div>;
  }

  const stats = {
    total: projects.length,
    activos: projects.filter(p => p.status === 'activo').length,
    planificacion: projects.filter(p => p.status === 'planificacion').length,
    finalizados: projects.filter(p => p.status === 'finalizado').length
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Proyectos</h2>
          <p className="text-gray-600">Administra proyectos de investigación</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Planificación</p>
              <p className="text-2xl font-bold text-gray-900">{stats.planificacion}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-gray-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Finalizados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.finalizados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  project.status === 'activo' ? 'bg-green-100 text-green-800' :
                  project.status === 'planificacion' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            {project.description && (
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">
                📅 Inicio: {project.start_date}
              </div>
              {project.end_date && (
                <div className="text-sm text-gray-600">
                  🏁 Fin: {project.end_date}
                </div>
              )}
              <div className="text-sm text-gray-600">
                📦 {project.resource_count || 0} recursos
              </div>
            </div>

            {project.progress !== null && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progreso</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando tu primer proyecto.
          </p>
        </div>
      )}
    </div>
  );
};