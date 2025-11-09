export class CreateReservation {
  /**
   * @param {import('../../application/repositories/iReservationRepository.js').IReservationRepository} reservationRepository
   * @param {import('../../../resources/application/repositories/iResourceRepository.js').IResourceRepository} resourceRepository
   */
  constructor(reservationRepository, resourceRepository) {
    this.reservationRepository = reservationRepository;
    this.resourceRepository = resourceRepository;
  }

  /**
   * @param {object} input
   * @param {object} input.data The reservation data from the request.
   * @param {number} input.userId The ID of the user creating the reservation.
   */
  async execute({ data, userId }) {
    const { resource_id, date, start_time, end_time, purpose, notes } = data;

    // Business Rule 1: Verify resource exists and is available.
    const resource = await this.resourceRepository.findById(resource_id);
    if (!resource) {
      throw new Error('Recurso no encontrado');
    }
    if (resource.status !== 'disponible') {
      throw new Error('Recurso no disponible');
    }

    // Business Rule 2: Verify no overlapping reservations.
    const overlaps = await this.reservationRepository.findOverlaps(resource_id, date, start_time, end_time);
    if (overlaps.length > 0) {
      throw new Error('Ya existe una reserva en ese horario');
    }

    // If all rules pass, create the reservation.
    const newReservation = await this.reservationRepository.save({
      resource_id,
      user_id: userId,
      date,
      start_time,
      end_time,
      purpose,
      notes,
      status: 'pendiente', // Initial status is always 'pendiente'.
    });

    return newReservation;
  }
}
