import express from 'express';
import resourceController from './resource.controller.js';
import { auth, adminAuth } from '../../../../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Obtener todos los recursos
router.get('/', auth, resourceController.getAllResources);

// Obtener recurso por ID
router.get('/:id', auth, resourceController.getResourceById);

// Crear recurso (solo admin)
router.post('/',
  auth,
  adminAuth,
  [
    body('name').trim().notEmpty().withMessage('El nombre del recurso es requerido'),
    body('type').trim().notEmpty().withMessage('El tipo de recurso es requerido'),
    body('status').trim().notEmpty().withMessage('El estado del recurso es requerido'),
  ],
  resourceController.createResource
);

// Actualizar recurso (solo admin)
router.put('/:id',
  auth,
  adminAuth,
  [
    body('name').optional().trim().notEmpty().withMessage('El nombre del recurso no puede estar vacío'),
    body('type').optional().trim().notEmpty().withMessage('El tipo de recurso no puede estar vacío'),
    body('status').optional().trim().notEmpty().withMessage('El estado del recurso no puede estar vacío'),
  ],
  resourceController.updateResource
);

// Eliminar recurso (solo admin)
router.delete('/:id', auth, adminAuth, resourceController.deleteResource);

export default router;
