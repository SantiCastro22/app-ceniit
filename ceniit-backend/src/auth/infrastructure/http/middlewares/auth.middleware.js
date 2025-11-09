import jwt from 'jsonwebtoken';

export class AuthMiddleware {
  /**
   * @param {import('../../../application/repositories/iUserRepository.js').IUserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
    // Bind 'this' to ensure userRepository is available in middleware methods
    this.auth = this.auth.bind(this);
    this.adminAuth = this.adminAuth.bind(this);
  }

  async auth(req, res, next) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'No hay token de autenticación' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Use the repository to get the user, decoupling from the database implementation
      const user = await this.userRepository.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      if (user.status === 'inactive') {
        return res.status(401).json({ message: 'Usuario inactivo' });
      }

      // Attach a safe user object (DTO) to the request
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      };

      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
    }
  }

  adminAuth(req, res, next) {
    // This middleware must run AFTER the auth middleware
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador' });
    }
    next();
  }
}
