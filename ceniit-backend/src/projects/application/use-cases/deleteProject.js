// src/projects/application/use-cases/deleteProject.js
import AppError from '../../../shared/errors/appError.js';

class DeleteProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id) {
    const success = await this.projectRepository.delete(id);
    if (!success) {
      throw new AppError('Proyecto no encontrado', 404);
    }
    return true;
  }
}

export default DeleteProject;
