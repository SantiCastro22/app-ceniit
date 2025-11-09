export class IReservationRepository {
  /**
   * @param {object} [options]
   * @param {number} [options.userId]
   * @returns {Promise<import('../../domain/reservation.js').Reservation[]>}
   */
  async findAll({ userId } = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {number} id
   * @returns {Promise<import('../../domain/reservation.js').Reservation|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {number} resourceId
   * @param {string} date
   * @param {string} startTime
   * @param {string} endTime
   * @returns {Promise<import('../../domain/reservation.js').Reservation[]>}
   */
  async findOverlaps(resourceId, date, startTime, endTime) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {object} reservationData
   * @returns {Promise<import('../../domain/reservation.js').Reservation>}
   */
  async save(reservationData) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {number} id
   * @param {string} status
   * @returns {Promise<import('../../domain/reservation.js').Reservation|null>}
   */
  async updateStatus(id, status) {
    throw new Error('Method not implemented');
  }
}
