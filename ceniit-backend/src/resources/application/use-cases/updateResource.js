// src/resources/application/use-cases/updateResource.js
import AppError from '../../../../src/shared/errors/appError.js';

class UpdateResource {
  constructor(resourceRepository) {
    this.resourceRepository = resourceRepository;
  }

  async execute(id, { name, description, type, location, status }) {
    const updatedResource = await this.resourceRepository.update(id, { name, description, type, location, status });
    if (!updatedResource) {
      throw new AppError('Recurso no encontrado', 404);
    }
    return updatedResource;
  }
}

export default UpdateResource;
