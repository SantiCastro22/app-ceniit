export class GetAllReservations {
  /**
   * @param {import('../../application/repositories/iReservationRepository.js').IReservationRepository} reservationRepository
   */
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  /**
   * @param {object} input
   * @param {object} input.user The user performing the action.
   * @param {number} input.user.id
   * @param {string} input.user.role
   */
  async execute({ user }) {
    const options = {};
    
    // The use case contains the business rule: non-admins can only see their own reservations.
    if (user.role !== 'admin') {
      options.userId = user.id;
    }
    
    return this.reservationRepository.findAll(options);
  }
}
