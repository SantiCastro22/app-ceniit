// src/resources/application/use-cases/getAllResources.js
class GetAllResources {
  constructor(resourceRepository) {
    this.resourceRepository = resourceRepository;
  }

  async execute() {
    return await this.resourceRepository.getAll();
  }
}

export default GetAllResources;
