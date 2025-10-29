import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los proyectos
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as creator_name,
       (SELECT COUNT(*) FROM project_resources WHERE project_id = p.id) as resource_count,
       (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count
       FROM projects p 
       LEFT JOIN users u ON p.created_by = u.id 
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
});

// Crear proyecto
router.post('/',
  auth,
  adminAuth,
  [
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    body('start_date').isDate().withMessage('Fecha de inicio inválida'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, status, start_date, end_date, budget, leader, progress } = req.body;

      const result = await pool.query(
        `INSERT INTO projects (name, description, status, start_date, end_date, budget, leader, progress, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [name, description, status || 'planificacion', start_date, end_date, budget, leader, progress || 0, req.user.id]
      );

      res.status(201).json({ message: 'Proyecto creado', project: result.rows[0] });
    } catch (error) {
      console.error('Error creando proyecto:', error);
      res.status(500).json({ message: 'Error al crear proyecto' });
    }
  }
);

// Actualizar proyecto
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, start_date, end_date, budget, leader, progress } = req.body;

    const result = await pool.query(
      `UPDATE projects 
       SET name = $1, description = $2, status = $3, start_date = $4, 
           end_date = $5, budget = $6, leader = $7, progress = $8
       WHERE id = $9 
       RETURNING *`,
      [name, description, status, start_date, end_date, budget, leader, progress, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json({ message: 'Proyecto actualizado', project: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando proyecto:', error);
    res.status(500).json({ message: 'Error al actualizar proyecto' });
  }
});

// Eliminar proyecto
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    res.status(500).json({ message: 'Error al eliminar proyecto' });
  }
});

export default router;
