// src/users/application/use-cases/deleteUser.js
import AppError from '../../../shared/errors/appError.js';

class DeleteUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ userId, requestingUser }) {
    // Business rule: You cannot delete your own user
    if (requestingUser.id === parseInt(userId)) {
      throw new AppError('No puedes eliminar tu propio usuario', 400);
    }

    const success = await this.userRepository.delete(userId);

    if (!success) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return true;
  }
}

export default DeleteUser;