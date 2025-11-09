export class UpdateReservationStatus {
  /**
   * @param {import('../../application/repositories/iReservationRepository.js').IReservationRepository} reservationRepository
   */
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  /**
   * @param {object} input
   * @param {number} input.reservationId
   * @param {string} input.newStatus
   * @param {object} input.user
   */
  async execute({ reservationId, newStatus, user }) {
    // 1. Find the reservation to ensure it exists.
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }

    // 2. Business Rule: Enforce permissions for status change.
    const isOwner = reservation.userId === user.id;
    const isAdmin = user.role === 'admin';

    // A non-admin can only cancel their own reservation.
    if (!isAdmin && (newStatus !== 'cancelada' || !isOwner)) {
      throw new Error('Acceso denegado: No tiene permisos para realizar esta acción.');
    }

    // 3. If permissions are valid, update the status.
    const updatedReservation = await this.reservationRepository.updateStatus(reservationId, newStatus);
    if (!updatedReservation) {
      // This would be an unexpected state, but good to handle.
      throw new Error('Error al actualizar la reserva.');
    }
    
    return updatedReservation;
  }
}
