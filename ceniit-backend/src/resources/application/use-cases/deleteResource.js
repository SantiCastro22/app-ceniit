// src/resources/application/use-cases/deleteResource.js
import AppError from '../../../../src/shared/errors/appError.js';

class DeleteResource {
  constructor(resourceRepository) {
    this.resourceRepository = resourceRepository;
  }

  async execute(id) {
    const success = await this.resourceRepository.delete(id);
    if (!success) {
      throw new AppError('Recurso no encontrado', 404);
    }
    return true;
  }
}

export default DeleteResource;
