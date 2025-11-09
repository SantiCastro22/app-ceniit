import express from 'express';
import { body, validationResult } from 'express-validator';
import projectController from './project.controller.js';
import { auth, adminAuth } from '../../../../middleware/auth.js';

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener todos los proyectos
router.get('/', auth, projectController.getAllProjects);

// Obtener proyecto por ID
router.get('/:id', auth, projectController.getProjectById);

// Crear proyecto (solo admin)
router.post('/',
  auth,
  adminAuth,
  [
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    body('start_date').isDate().withMessage('Fecha de inicio inválida'),
    body('end_date').optional().isDate().withMessage('Fecha de fin inválida'),
    body('budget').optional().isNumeric().withMessage('El presupuesto debe ser numérico'),
    body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('El progreso debe ser un entero entre 0 y 100'),
  ],
  handleValidationErrors,
  projectController.createProject
);

// Actualizar proyecto (solo admin)
router.put('/:id',
  auth,
  adminAuth,
  [
    body('name').optional().trim().notEmpty().withMessage('El nombre es requerido'),
    body('start_date').optional().isDate().withMessage('Fecha de inicio inválida'),
    body('end_date').optional().isDate().withMessage('Fecha de fin inválida'),
    body('budget').optional().isNumeric().withMessage('El presupuesto debe ser numérico'),
    body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('El progreso debe ser un entero entre 0 y 100'),
  ],
  handleValidationErrors,
  projectController.updateProject
);

// Eliminar proyecto (solo admin)
router.delete('/:id', auth, adminAuth, projectController.deleteProject);

export default router;
