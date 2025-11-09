// src/projects/application/use-cases/updateProject.js
import AppError from '../../../shared/errors/appError.js';

class UpdateProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id, projectData) {
    const project = await this.projectRepository.update(id, projectData);
    if (!project) {
      throw new AppError('Proyecto no encontrado', 404);
    }
    return project;
  }
}

export default UpdateProject;
