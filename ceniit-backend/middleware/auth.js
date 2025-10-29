import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No hay token de autenticación' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      'SELECT id, name, email, role, status FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (result.rows[0].status === 'inactive') {
      return res.status(401).json({ message: 'Usuario inactivo' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador' });
  }
  next();
};
