import { IResourceRepository } from '../../application/repositories/iResourceRepository.js';
import { createResource } from '../../domain/resource.js';

export class ResourceRepository extends IResourceRepository {
  /**
   * @param {import('pg').Pool} pool
   */
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async getAll() {
    const result = await this.pool.query('SELECT * FROM resources ORDER BY name ASC');
    return result.rows.map(row => createResource(row));
  }

  async findById(id) {
    const result = await this.pool.query('SELECT * FROM resources WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return createResource(result.rows[0]);
  }

  async create({ name, description, type, location, status }) {
    const result = await this.pool.query(
      'INSERT INTO resources (name, description, type, location, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, type, location, status]
    );
    return createResource(result.rows[0]);
  }

  async update(id, { name, description, type, location, status }) {
    const result = await this.pool.query(
      'UPDATE resources SET name = $1, description = $2, type = $3, location = $4, status = $5 WHERE id = $6 RETURNING *',
      [name, description, type, location, status, id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return createResource(result.rows[0]);
  }

  async delete(id) {
    const result = await this.pool.query('DELETE FROM resources WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }
}
