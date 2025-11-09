// src/projects/application/use-cases/getProjectById.js
import AppError from '../../../shared/errors/appError.js';

class GetProjectById {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new AppError('Proyecto no encontrado', 404);
    }
    return project;
  }
}

export default GetProjectById;
