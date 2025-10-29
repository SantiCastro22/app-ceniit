import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Obtener usuario por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Solo admin o el mismo usuario
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const result = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

// Actualizar usuario
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;

    // Solo admin o el mismo usuario
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    let query = 'UPDATE users SET name = $1, email = $2';
    let params = [name, email];
    let paramCount = 2;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      paramCount++;
      query += `, password = $${paramCount}`;
      params.push(hashedPassword);
    }

    if (req.user.role === 'admin' && role) {
      paramCount++;
      query += `, role = $${paramCount}`;
      params.push(role);
    }

    if (req.user.role === 'admin' && status) {
      paramCount++;
      query += `, status = $${paramCount}`;
      params.push(status);
    }

    paramCount++;
    query += ` WHERE id = $${paramCount} RETURNING id, name, email, role, status`;
    params.push(id);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado', user: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir eliminar el propio usuario
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' });
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

export default router;