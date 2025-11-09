// src/resources/application/use-cases/getResourceById.js
import AppError from '../../../../src/shared/errors/appError.js';

class GetResourceById {
  constructor(resourceRepository) {
    this.resourceRepository = resourceRepository;
  }

  async execute(id) {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) {
      throw new AppError('Recurso no encontrado', 404);
    }
    return resource;
  }
}

export default GetResourceById;
