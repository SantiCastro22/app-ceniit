import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Obtener todas las reservas
router.get('/', auth, async (req, res) => {
  try {
    let query = `
      SELECT r.*, res.name as resource_name, u.name as user_name 
      FROM reservations r 
      JOIN resources res ON r.resource_id = res.id 
      JOIN users u ON r.user_id = u.id 
    `;

    // Si no es admin, solo ver sus propias reservas
    if (req.user.role !== 'admin') {
      query += ' WHERE r.user_id = $1';
      const result = await pool.query(query + ' ORDER BY r.date DESC, r.start_time DESC', [req.user.id]);
      return res.json(result.rows);
    }

    const result = await pool.query(query + ' ORDER BY r.date DESC, r.start_time DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
});

// Crear reserva
router.post('/',
  auth,
  [
    body('resource_id').isInt().withMessage('ID de recurso inválido'),
    body('date').isDate().withMessage('Fecha inválida'),
    body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de inicio inválida'),
    body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de fin inválida'),
    body('purpose').trim().notEmpty().withMessage('El propósito es requerido'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { resource_id, date, start_time, end_time, purpose, notes } = req.body;

      // Verificar que el recurso existe y está disponible
      const resource = await pool.query(
        'SELECT * FROM resources WHERE id = $1',
        [resource_id]
      );

      if (resource.rows.length === 0) {
        return res.status(404).json({ message: 'Recurso no encontrado' });
      }

      if (resource.rows[0].status !== 'disponible') {
        return res.status(400).json({ message: 'Recurso no disponible' });
      }

      // Verificar solapamiento de reservas
      const overlap = await pool.query(
        `SELECT id FROM reservations 
         WHERE resource_id = $1 AND date = $2 
         AND status NOT IN ('cancelada', 'rechazada')
         AND (
           (start_time <= $3 AND end_time > $3) OR
           (start_time < $4 AND end_time >= $4) OR
           (start_time >= $3 AND end_time <= $4)
         )`,
        [resource_id, date, start_time, end_time]
      );

      if (overlap.rows.length > 0) {
        return res.status(400).json({ message: 'Ya existe una reserva en ese horario' });
      }

      const result = await pool.query(
        `INSERT INTO reservations (resource_id, user_id, date, start_time, end_time, purpose, notes, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [resource_id, req.user.id, date, start_time, end_time, purpose, notes, 'pendiente']
      );

      res.status(201).json({ message: 'Reserva creada', reservation: result.rows[0] });
    } catch (error) {
      console.error('Error creando reserva:', error);
      res.status(500).json({ message: 'Error al crear reserva' });
    }
  }
);

// Actualizar estado de reserva (aprobar/rechazar)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Obtener reserva
    const reservation = await pool.query('SELECT * FROM reservations WHERE id = $1', [id]);

    if (reservation.rows.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Solo admin puede aprobar/rechazar, usuario solo puede cancelar sus propias reservas
    if (req.user.role !== 'admin' && (status !== 'cancelada' || reservation.rows[0].user_id !== req.user.id)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const result = await pool.query(
      'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({ message: 'Reserva actualizada', reservation: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando reserva:', error);
    res.status(500).json({ message: 'Error al actualizar reserva' });
  }
});

export default router;