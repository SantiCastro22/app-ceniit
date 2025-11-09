import { validationResult } from 'express-validator';

export class ReservationController {
  /**
   * @param {import('../../application/use-cases/getAllReservations.js').GetAllReservations} getAllReservations
   * @param {import('../../application/use-cases/createReservation.js').CreateReservation} createReservation
   * @param {import('../../application/use-cases/updateReservationStatus.js').UpdateReservationStatus} updateReservationStatus
   */
  constructor(getAllReservations, createReservation, updateReservationStatus) {
    this.getAllReservations = getAllReservations;
    this.createReservation = createReservation;
    this.updateReservationStatus = updateReservationStatus;
  }

  async getAll(req, res) {
    try {
      // The user object is attached by the auth middleware.
      const reservations = await this.getAllReservations.execute({ user: req.user });
      res.status(200).json(reservations);
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      res.status(500).json({ message: 'Error al obtener reservas' });
    }
  }

  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const reservation = await this.createReservation.execute({ 
        data: req.body, 
        userId: req.user.id 
      });
      res.status(201).json({ message: 'Reserva creada', reservation });
    } catch (error) {
      // Handle specific business rule errors from the use case.
      if (error.message === 'Recurso no encontrado') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Recurso no disponible' || error.message === 'Ya existe una reserva en ese horario') {
        return res.status(400).json({ message: error.message });
      }
      console.error('Error creando reserva:', error);
      res.status(500).json({ message: 'Error al crear reserva' });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'El estado es requerido' });
      }

      const reservation = await this.updateReservationStatus.execute({
        reservationId: id,
        newStatus: status,
        user: req.user,
      });
      res.status(200).json({ message: 'Reserva actualizada', reservation });
    } catch (error) {
      if (error.message === 'Reserva no encontrada') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('Acceso denegado')) {
        return res.status(403).json({ message: error.message });
      }
      console.error('Error actualizando reserva:', error);
      res.status(500).json({ message: 'Error al actualizar reserva' });
    }
  }
}
