import GetAllProjects from '../../application/use-cases/getAllProjects.js';
import GetProjectById from '../../application/use-cases/getProjectById.js';
import CreateProject from '../../application/use-cases/createProject.js';
import UpdateProject from '../../application/use-cases/updateProject.js';
import DeleteProject from '../../application/use-cases/deleteProject.js';
import ProjectRepository from '../database/projectRepository.js';

const projectRepository = new ProjectRepository();

const handleHttpError = (res, error) => {
  console.error(error);
  if (error.isOperational) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

class ProjectController {
  async getAllProjects(req, res) {
    try {
      const getAllProjects = new GetAllProjects(projectRepository);
      const projects = await getAllProjects.execute();
      res.json(projects);
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async getProjectById(req, res) {
    try {
      const getProjectById = new GetProjectById(projectRepository);
      const project = await getProjectById.execute(req.params.id);
      res.json(project);
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async createProject(req, res) {
    try {
      const createProject = new CreateProject(projectRepository);
      const projectData = { ...req.body, created_by: req.user.id };
      const project = await createProject.execute(projectData);
      res.status(201).json({ message: 'Proyecto creado', project });
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async updateProject(req, res) {
    try {
      const updateProject = new UpdateProject(projectRepository);
      const project = await updateProject.execute(req.params.id, req.body);
      res.json({ message: 'Proyecto actualizado', project });
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async deleteProject(req, res) {
    try {
      const deleteProject = new DeleteProject(projectRepository);
      await deleteProject.execute(req.params.id);
      res.json({ message: 'Proyecto eliminado exitosamente' });
    } catch (error) {
      handleHttpError(res, error);
    }
  }
}

export default new ProjectController();
