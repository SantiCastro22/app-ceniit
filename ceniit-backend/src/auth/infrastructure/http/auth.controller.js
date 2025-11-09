import { validationResult } from 'express-validator';

export class AuthController {
  /**
   * @param {import('../../application/use-cases/registerUser.js').RegisterUser} registerUser
   * @param {import('../../application/use-cases/loginUser.js').LoginUser} loginUser
   * @param {import('../../application/use-cases/getAuthenticatedUser.js').GetAuthenticatedUser} getAuthenticatedUser
   */
  constructor(registerUser, loginUser, getAuthenticatedUser) {
    this.registerUser = registerUser;
    this.loginUser = loginUser;
    this.getAuthenticatedUser = getAuthenticatedUser;
  }

  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body;
      const result = await this.registerUser.execute({ name, email, password, role });
      
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        ...result,
      });
    } catch (error) {
      if (error.message === 'El email ya está registrado') {
        return res.status(400).json({ message: error.message });
      }
      console.error('Error en registro:', error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  }

  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      console.log('AuthController login called with:', { email, password });
      const result = await this.loginUser.execute({ email, password });
      console.log('Login successful, result:', result);
      res.status(200).json(result);
    } catch (error) {
      console.log('Login error:', error);
      if (error.message === 'Credenciales inválidas' || error.message === 'Usuario inactivo') {
        return res.status(401).json({ message: error.message });
      }
      console.error('Error en login:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  }

  async getMe(req, res) {
    try {
      // req.user.id is attached by the auth middleware
      const userId = req.user.id;
      const user = await this.getAuthenticatedUser.execute({ userId });
      res.status(200).json({ user });
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ message: error.message });
      }
      console.error('Error en getMe:', error);
      res.status(500).json({ message: 'Error al obtener datos del usuario' });
    }
  }
}
