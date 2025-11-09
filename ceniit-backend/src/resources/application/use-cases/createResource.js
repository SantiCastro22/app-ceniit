// src/resources/application/use-cases/createResource.js
import AppError from '../../../../src/shared/errors/appError.js';

class CreateResource {
  constructor(resourceRepository) {
    this.resourceRepository = resourceRepository;
  }

  async execute({ name, description, type, location, status }) {
    if (!name || !status || !type) {
      throw new AppError('El nombre, tipo y estado del recurso son requeridos', 400);
    }
    // Additional business rules can be added here
    const newResource = await this.resourceRepository.create({ name, description, type, location, status });
    return newResource;
  }
}

export default CreateResource;
