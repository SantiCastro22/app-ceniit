// src/users/application/use-cases/getUserById.js
import AppError from '../../../shared/errors/appError.js';

class GetUserById {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ userId, requestingUser }) {
    // Authorization: only admin or the user themselves can see the profile
    if (requestingUser.role !== 'admin' && requestingUser.id !== parseInt(userId)) {
      throw new AppError('Acceso denegado', 403);
    }

    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return user;
  }
}

export default GetUserById;