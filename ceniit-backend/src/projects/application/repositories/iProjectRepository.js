// src/projects/application/repositories/iProjectRepository.js

class IProjectRepository {
  constructor() {
    if (this.constructor === IProjectRepository) {
      throw new Error("Can't instantiate abstract class!");
    }
  }

  async getAll() {
    throw new Error("Method 'getAll()' must be implemented.");
  }

  async findById(id) {
    throw new Error("Method 'findById()' must be implemented.");
  }

  async create(projectData) {
    throw new Error("Method 'create()' must be implemented.");
  }

  async update(id, projectData) {
    throw new Error("Method 'update()' must be implemented.");
  }

  async delete(id) {
    throw new Error("Method 'delete()' must be implemented.");
  }
}

export default IProjectRepository;
