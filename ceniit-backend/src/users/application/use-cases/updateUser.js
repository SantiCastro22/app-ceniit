// src/users/application/use-cases/updateUser.js
import AppError from '../../../shared/errors/appError.js';

class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ userId, data, requestingUser }) {
    // Authorization: only admin or the user themselves can update
    if (requestingUser.role !== 'admin' && requestingUser.id !== parseInt(userId)) {
      throw new AppError('Acceso denegado', 403);
    }

    const { name, email, password, role, status } = data;
    const updateData = { name, email, password };

    // Only admin can change role and status
    if (requestingUser.role === 'admin') {
      if (role) updateData.role = role;
      if (status) updateData.status = status;
    }

    const updatedUser = await this.userRepository.update(userId, updateData);

    if (!updatedUser) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return updatedUser;
  }
}

export default UpdateUser;