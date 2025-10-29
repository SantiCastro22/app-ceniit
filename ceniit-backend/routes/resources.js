import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los recursos
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as creator_name 
       FROM resources r 
       LEFT JOIN users u ON r.created_by = u.id 
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo recursos:', error);
    res.status(500).json({ message: 'Error al obtener recursos' });
  }
});

// Crear recurso
router.post('/',
  auth,
  adminAuth,
  [
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    body('type').isIn(['sala', 'equipo']).withMessage('Tipo invalido'),
    body('capacity')
      .optional({ checkFalsy: true })
      .isInt({ min: 0 })
      .withMessage('La capacidad debe ser un numero entero positivo'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, type, status, capacity, location, description } = req.body;
      const dbCapacity = capacity === '' ? null : capacity;

      const result = await pool.query(
        `INSERT INTO resources (name, type, status, capacity, location, description, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [name, type, status || 'disponible', dbCapacity, location, description, req.user.id]
      );

      res.status(201).json({ message: 'Recurso creado', resource: result.rows[0] });
    } catch (error) {
      console.error('Error creando recurso:', error);
      res.status(500).json({ message: 'Error al crear recurso' });
    }
  }
);

// Actualizar recurso
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, status, capacity, location, description, maintenance_start, maintenance_end, maintenance_reason } = req.body;

    const result = await pool.query(
      `UPDATE resources 
       SET name = $1, type = $2, status = $3, capacity = $4, location = $5, 
           description = $6, maintenance_start = $7, maintenance_end = $8, maintenance_reason = $9
       WHERE id = $10 
       RETURNING *`,
      [name, type, status, capacity, location, description, maintenance_start, maintenance_end, maintenance_reason, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recurso no encontrado' });
    }

    res.json({ message: 'Recurso actualizado', resource: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando recurso:', error);
    res.status(500).json({ message: 'Error al actualizar recurso' });
  }
});

// Eliminar recurso
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recurso no encontrado' });
    }

    res.json({ message: 'Recurso eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando recurso:', error);
    res.status(500).json({ message: 'Error al eliminar recurso' });
  }
});

export default router;