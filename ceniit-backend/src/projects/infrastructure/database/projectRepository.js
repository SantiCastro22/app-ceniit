import pool from '../../../../config/database.js';
import Project from '../../domain/project.js';
import IProjectRepository from '../../application/repositories/iProjectRepository.js';

class ProjectRepository extends IProjectRepository {
  async getAll() {
    const result = await pool.query(
      `SELECT p.*, u.name as creator_name,
       (SELECT COUNT(*) FROM project_resources WHERE project_id = p.id) as resource_count,
       (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count
       FROM projects p 
       LEFT JOIN users u ON p.created_by = u.id 
       ORDER BY p.created_at DESC`
    );
    return result.rows.map(row => new Project(row));
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return new Project(result.rows[0]);
  }

  async create({ name, description, status, start_date, end_date, budget, leader, progress, created_by }) {
    const result = await pool.query(
      `INSERT INTO projects (name, description, status, start_date, end_date, budget, leader, progress, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [name, description, status || 'planificacion', start_date, end_date, budget, leader, progress || 0, created_by]
    );
    return new Project(result.rows[0]);
  }

  async update(id, { name, description, status, start_date, end_date, budget, leader, progress }) {
    const result = await pool.query(
      `UPDATE projects 
       SET name = $1, description = $2, status = $3, start_date = $4, 
           end_date = $5, budget = $6, leader = $7, progress = $8
       WHERE id = $9 
       RETURNING *`,
      [name, description, status, start_date, end_date, budget, leader, progress, id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return new Project(result.rows[0]);
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }
}

export default ProjectRepository;
