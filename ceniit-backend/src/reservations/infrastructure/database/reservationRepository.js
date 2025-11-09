import { IReservationRepository } from '../../application/repositories/iReservationRepository.js';
import { createReservation } from '../../domain/reservation.js';

export class ReservationRepository extends IReservationRepository {
  /**
   * @param {import('pg').Pool} pool
   */
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findAll({ userId } = {}) {
    let query = `
      SELECT r.*, res.name as resource_name, u.name as user_name 
      FROM reservations r 
      JOIN resources res ON r.resource_id = res.id 
      JOIN users u ON r.user_id = u.id 
    `;
    const params = [];

    if (userId) {
      query += ' WHERE r.user_id = $1';
      params.push(userId);
    }

    query += ' ORDER BY r.date DESC, r.start_time DESC';

    const result = await this.pool.query(query, params);
    return result.rows.map(row => createReservation(row));
  }

  async findById(id) {
    const result = await this.pool.query('SELECT * FROM reservations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return createReservation(result.rows[0]);
  }

  async findOverlaps(resourceId, date, startTime, endTime) {
    const result = await this.pool.query(
      `SELECT id FROM reservations 
       WHERE resource_id = $1 AND date = $2 
       AND status NOT IN ('cancelada', 'rechazada')
       AND (
         (start_time <= $3 AND end_time > $3) OR
         (start_time < $4 AND end_time >= $4) OR
         (start_time >= $3 AND end_time <= $4)
       )`,
      [resourceId, date, startTime, endTime]
    );
    return result.rows.map(row => createReservation(row));
  }

  async save(reservationData) {
    const { resource_id, user_id, date, start_time, end_time, purpose, notes, status } = reservationData;
    const result = await this.pool.query(
      `INSERT INTO reservations (resource_id, user_id, date, start_time, end_time, purpose, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [resource_id, user_id, date, start_time, end_time, purpose, notes, status]
    );
    return createReservation(result.rows[0]);
  }

  async updateStatus(id, status) {
    const result = await this.pool.query(
      'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return createReservation(result.rows[0]);
  }
}
