// src/projects/application/use-cases/getAllProjects.js
class GetAllProjects {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute() {
    return await this.projectRepository.getAll();
  }
}

export default GetAllProjects;
