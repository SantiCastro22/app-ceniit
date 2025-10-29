import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, CheckCircle, Clock, Wrench } from 'lucide-react';
import { resourceService } from '../../services/resourceService';
import { ResourceForm } from './ResourceForm';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';

export const ResourceList = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingResource, setDeletingResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getAll();
      setResources(data);
    } catch (error) {
      console.error('Error cargando recursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (resourceData) => {
    try {
      await resourceService.create(resourceData);
      await loadResources();
      setShowForm(false);
    } catch (error) {
      console.error('Error creando recurso:', error);
      alert('Error al crear recurso');
    }
  };

  const handleUpdate = async (resourceData) => {
    try {
      await resourceService.update(editingResource.id, resourceData);
      await loadResources();
      setShowForm(false);
      setEditingResource(null);
    } catch (error) {
      console.error('Error actualizando recurso:', error);
      alert('Error al actualizar recurso');
    }
  };

  const handleDelete = async () => {
    try {
      await resourceService.delete(deletingResource.id);
      await loadResources();
      setShowDeleteDialog(false);
      setDeletingResource(null);
    } catch (error) {
      console.error('Error eliminando recurso:', error);
      alert('Error al eliminar recurso');
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: resources.length,
    disponibles: resources.filter(r => r.status === 'disponible').length,
    ocupados: resources.filter(r => r.status === 'ocupado').length,
    mantenimiento: resources.filter(r => r.status === 'mantenimiento').length
  };

  if (loading) {
    return <div className="p-6">Cargando recursos...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Recursos</h2>
          <p className="text-gray-600">Administra equipos y salas del CENIIT</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Recurso
          </button>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
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
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.disponibles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ocupados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ocupados}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <Wrench className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mantenimiento</p>
              <p className="text-2xl font-bold text-gray-900">{stats.mantenimiento}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar recursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los tipos</option>
            <option value="sala">Salas</option>
            <option value="equipo">Equipos</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="ocupado">Ocupado</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>
      </div>

      {/* Lista de recursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {resource.type}
                </span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                resource.status === 'disponible' ? 'bg-green-100 text-green-800' :
                resource.status === 'ocupado' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {resource.status}
              </span>
            </div>

            {resource.description && (
              <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
            )}

            {resource.location && (
              <p className="text-sm text-gray-500 mb-4">📍 {resource.location}</p>
            )}

            {resource.capacity && (
              <p className="text-sm text-gray-500 mb-4">👥 Capacidad: {resource.capacity}</p>
            )}

            {user?.role === 'admin' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingResource(resource);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setDeletingResource(resource);
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

      {filteredResources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay recursos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'No se encontraron recursos con los filtros aplicados.'
              : 'No hay recursos disponibles.'
            }
          </p>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingResource(null);
        }}
        title={editingResource ? 'Editar Recurso' : 'Nuevo Recurso'}
      >
        <ResourceForm
          resource={editingResource}
          onSubmit={editingResource ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingResource(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingResource(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Recurso"
        message={`¿Estás seguro de que quieres eliminar el recurso "${deletingResource?.name}"?`}
      />
    </div>
  );
};

