// src/projects/application/use-cases/createProject.js
class CreateProject {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectData) {
    // Business logic can be added here, e.g. validation
    return await this.projectRepository.create(projectData);
  }
}

export default CreateProject;
