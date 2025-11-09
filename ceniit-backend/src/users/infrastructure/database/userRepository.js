import bcrypt from 'bcryptjs';
import pool from '../../../../config/database.js';
import User from '../../domain/user.js';
import IUserRepository from '../../application/repositories/iUserRepository.js';

class UserRepository extends IUserRepository {
  constructor() {
    super();
  }

  async getAll() {
    const result = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows.map(row => new User(row.id, row.name, row.email, row.role, row.status, row.created_at));
  }

  async getById(id) {
    const result = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return new User(row.id, row.name, row.email, row.role, row.status, row.created_at);
  }

  async update(id, { name, email, password, role, status }) {
    let query = 'UPDATE users SET name = $1, email = $2';
    let params = [name, email];
    let paramCount = 2;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      paramCount++;
      query += `, password = $${paramCount}`;
      params.push(hashedPassword);
    }

    if (role) {
      paramCount++;
      query += `, role = $${paramCount}`;
      params.push(role);
    }

    if (status) {
      paramCount++;
      query += `, status = $${paramCount}`;
      params.push(status);
    }

    paramCount++;
    query += ` WHERE id = $${paramCount} RETURNING id, name, email, role, status, created_at`;
    params.push(id);

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return new User(row.id, row.name, row.email, row.role, row.status, row.created_at);
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }
}

export default UserRepository;
