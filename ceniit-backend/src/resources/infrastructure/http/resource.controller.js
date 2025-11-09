import CreateResource from '../../application/use-cases/createResource.js';
import GetAllResources from '../../application/use-cases/getAllResources.js';
import GetResourceById from '../../application/use-cases/getResourceById.js';
import UpdateResource from '../../application/use-cases/updateResource.js';
import DeleteResource from '../../application/use-cases/deleteResource.js';
import { ResourceRepository } from '../database/resourceRepository.js';
import pool from '../../../../config/database.js'; // Assuming pool is needed for repository instantiation

const resourceRepository = new ResourceRepository(pool);

const handleHttpError = (res, error) => {
  console.error(error);
  if (error.isOperational) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

class ResourceController {
  async createResource(req, res) {
    try {
      const createResourceUseCase = new CreateResource(resourceRepository);
      const resource = await createResourceUseCase.execute(req.body);
      res.status(201).json({ message: 'Recurso creado', resource });
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async getAllResources(req, res) {
    try {
      const getAllResourcesUseCase = new GetAllResources(resourceRepository);
      const resources = await getAllResourcesUseCase.execute();
      res.json(resources);
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async getResourceById(req, res) {
    try {
      const getResourceByIdUseCase = new GetResourceById(resourceRepository);
      const resource = await getResourceByIdUseCase.execute(req.params.id);
      res.json(resource);
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async updateResource(req, res) {
    try {
      const updateResourceUseCase = new UpdateResource(resourceRepository);
      const resource = await updateResourceUseCase.execute(req.params.id, req.body);
      res.json({ message: 'Recurso actualizado', resource });
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async deleteResource(req, res) {
    try {
      const deleteResourceUseCase = new DeleteResource(resourceRepository);
      await deleteResourceUseCase.execute(req.params.id);
      res.json({ message: 'Recurso eliminado exitosamente' });
    } catch (error) {
      handleHttpError(res, error);
    }
  }
}

export default new ResourceController();
