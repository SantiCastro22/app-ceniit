import { IUserRepository } from '../../application/repositories/iUserRepository.js';
import { createUser } from '../../domain/user.js';

export class UserRepository extends IUserRepository {
  /**
   * @param {import('pg').Pool} pool
   */
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findByEmail(email) {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return null;
    }
    // The data from the DB is used to create a domain entity
    return createUser(result.rows[0]);
  }

  async findById(id) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return createUser(result.rows[0]);
  }

  async save(user) {
    const { name, email, password, role } = user;
    const result = await this.pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, role]
    );
    return createUser(result.rows[0]);
  }

  async findAll() {
    const result = await this.pool.query('SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC');
    return result.rows.map(row => createUser(row));
  }

  async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
    
    const query = {
      text: `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      values: [...values, id],
    };

    const result = await this.pool.query(query);

    if (result.rows.length === 0) {
      return null;
    }
    return createUser(result.rows[0]);
  }

  async delete(id) {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}
