import express from 'express';
import { body } from 'express-validator';

// Validation chains are co-located with the routes that use them.
const registerValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
];

/**
 * Creates the authentication router.
 * @param {object} dependencies
 * @param {import('./auth.controller.js').AuthController} dependencies.authController
 * @param {import('./middlewares/auth.middleware.js').AuthMiddleware} dependencies.authMiddleware
 * @returns {express.Router}
 */
export const createAuthRouter = ({ authController, authMiddleware }) => {
  const router = express.Router();

  // The actual route definitions. They are clean and declarative.
  // They wire together validation, controller methods, and middleware.
  router.post(
    '/register',
    registerValidation,
    (req, res) => authController.register(req, res)
  );

  router.post(
    '/login',
    loginValidation,
    (req, res) => authController.login(req, res)
  );

  router.get(
    '/me',
    authMiddleware.auth, // Protect the route
    (req, res) => authController.getMe(req, res)
  );

  return router;
};
