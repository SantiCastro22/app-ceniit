import express from 'express';
import { body } from 'express-validator';

const createReservationValidation = [
  body('resource_id').isInt({ min: 1 }).withMessage('ID de recurso inválido'),
  body('date').isISO8601().toDate().withMessage('Fecha inválida'),
  body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de inicio inválida (HH:MM)'),
  body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de fin inválida (HH:MM)'),
  body('purpose').trim().notEmpty().withMessage('El propósito es requerido'),
];

/**
 * @param {object} deps
 * @param {import('./reservation.controller.js').ReservationController} deps.reservationController
 * @param {import('../../../auth/infrastructure/http/middlewares/auth.middleware.js').AuthMiddleware} deps.authMiddleware
 * @returns {express.Router}
 */
export const createReservationRouter = ({ reservationController, authMiddleware }) => {
  const router = express.Router();

  // All reservation routes are protected
  router.use(authMiddleware.auth);

  router.get(
    '/', 
    (req, res) => reservationController.getAll(req, res)
  );

  router.post(
    '/',
    createReservationValidation,
    (req, res) => reservationController.create(req, res)
  );

  router.put(
    '/:id',
    (req, res) => reservationController.updateStatus(req, res)
  );

  return router;
};
