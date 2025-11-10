import React, { useState, useEffect } from 'react';
import { resourceService } from '../../services/resourceService';

export const ReservationForm = ({ reservation = null, onSubmit, onCancel }) => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    resource_id: reservation?.resource_id || '',
    date: reservation?.date || '',
    start_time: reservation?.start_time || '',
    end_time: reservation?.end_time || '',
    purpose: reservation?.purpose || '',
    notes: reservation?.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingResources, setLoadingResources] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoadingResources(true);
      const data = await resourceService.getAll();
      // Filtrar solo recursos disponibles
      const availableResources = data.filter(r => r.status === 'disponible');
      setResources(availableResources);
    } catch (error) {
      console.error('Error cargando recursos:', error);
    } finally {
      setLoadingResources(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.resource_id) {
      newErrors.resource_id = 'Selecciona un recurso';
    }

    if (!formData.date) {
      newErrors.date = 'Selecciona una fecha';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'La fecha no puede ser en el pasado';
      }
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Selecciona hora de inicio';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'Selecciona hora de fin';
    }

    if (formData.start_time && formData.end_time) {
      if (formData.start_time >= formData.end_time) {
        newErrors.end_time = 'La hora de fin debe ser posterior a la de inicio';
      }
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Indica el propósito de la reserva';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  if (loadingResources) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recurso *
        </label>
        <select
          name="resource_id"
          value={formData.resource_id}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.resource_id ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={!!reservation}
        >
          <option value="">Selecciona un recurso</option>
          {resources.map(resource => (
            <option key={resource.id} value={resource.id}>
              {resource.name} - {resource.type} 
              {resource.location && ` (${resource.location})`}
            </option>
          ))}
        </select>
        {errors.resource_id && (
          <p className="mt-1 text-xs text-red-600">{errors.resource_id}</p>
        )}
        {resources.length === 0 && (
          <p className="mt-1 text-xs text-yellow-600">
            No hay recursos disponibles en este momento
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha *
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={today}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.date && (
          <p className="mt-1 text-xs text-red-600">{errors.date}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora inicio *
          </label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.start_time ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.start_time && (
            <p className="mt-1 text-xs text-red-600">{errors.start_time}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hora fin *
          </label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.end_time ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.end_time && (
            <p className="mt-1 text-xs text-red-600">{errors.end_time}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Propósito *
        </label>
        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="¿Para qué necesitas este recurso?"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.purpose ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.purpose && (
          <p className="mt-1 text-xs text-red-600">{errors.purpose}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas adicionales (opcional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Información adicional sobre la reserva..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          Tu solicitud de reserva quedará pendiente hasta que un administrador la apruebe.
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || resources.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Solicitando...' : 'Solicitar Reserva'}
        </button>
      </div>
    </div>
  );
};