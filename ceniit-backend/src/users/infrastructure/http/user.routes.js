import express from 'express';
import userController from './user.controller.js';
import { auth, adminAuth } from '../../../../middleware/auth.js';

const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get('/', auth, adminAuth, userController.getAllUsers);

// Obtener usuario por ID
router.get('/:id', auth, userController.getUserById);

// Actualizar usuario
router.put('/:id', auth, userController.updateUser);

// Eliminar usuario (solo admin)
router.delete('/:id', auth, adminAuth, userController.deleteUser);

export default router;