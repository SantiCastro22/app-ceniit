import React, { useState, useEffect } from 'react';
import { Plus, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { ProjectForm } from './ProjectForm';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';

export const ProjectList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

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

  const handleCreateProject = async (projectData) => {
    try {
      await projectService.create(projectData);
      await loadProjects();
      setShowProjectModal(false);
      alert('Proyecto creado exitosamente');
    } catch (error) {
      console.error('Error creando proyecto:', error);
      alert(error.response?.data?.message || 'Error al crear proyecto');
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      await projectService.update(editingProject.id, projectData);
      await loadProjects();
      setShowProjectModal(false);
      setEditingProject(null);
      alert('Proyecto actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando proyecto:', error);
      alert('Error al actualizar proyecto');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await projectService.delete(deletingProject.id);
      await loadProjects();
      setShowDeleteDialog(false);
      setDeletingProject(null);
      alert('Proyecto eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      alert('Error al eliminar proyecto');
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filterStatus === 'all') return true;
    return project.status === filterStatus;
  });

  const stats = {
    total: projects.length,
    activos: projects.filter(p => p.status === 'activo').length,
    planificacion: projects.filter(p => p.status === 'planificacion').length,
    finalizados: projects.filter(p => p.status === 'finalizado').length
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Proyectos</h2>
          <p className="text-gray-600">Administra proyectos de investigación</p>
        </div>
        <button 
          onClick={() => setShowProjectModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </button>
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
            <XCircle className="h-8 w-8 text-gray-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Finalizados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.finalizados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los estados</option>
          <option value="planificacion">En Planificación</option>
          <option value="activo">Activos</option>
          <option value="finalizado">Finalizados</option>
        </select>
      </div>

      {/* Grid de proyectos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  project.status === 'activo' ? 'bg-green-100 text-green-800' :
                  project.status === 'planificacion' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            {project.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">
                📅 Inicio: {new Date(project.start_date).toLocaleDateString('es-AR')}
              </div>
              {project.end_date && (
                <div className="text-sm text-gray-600">
                  🏁 Fin: {new Date(project.end_date).toLocaleDateString('es-AR')}
                </div>
              )}
              <div className="text-sm text-gray-600">
                📦 {project.resource_count || 0} recursos
              </div>
              {project.leader && (
                <div className="text-sm text-gray-600">
                  👤 Líder: {project.leader}
                </div>
              )}
            </div>

            {project.progress !== null && project.progress !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progreso</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {user?.role === 'admin' && (
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => {
                    setEditingProject(project);
                    setShowProjectModal(true);
                  }}
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setDeletingProject(project);
                    setShowDeleteDialog(true);
                  }}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterStatus !== 'all'
              ? 'No se encontraron proyectos con este estado.'
              : 'Comienza creando tu primer proyecto.'
            }
          </p>
          <button
            onClick={() => setShowProjectModal(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </button>
        </div>
      )}

      {/* Modal para crear/editar proyecto */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      >
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          onCancel={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
        />
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingProject(null);
        }}
        onConfirm={handleDeleteProject}
        title="Eliminar Proyecto"
        message={`¿Estás seguro de que quieres eliminar el proyecto "${deletingProject?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};