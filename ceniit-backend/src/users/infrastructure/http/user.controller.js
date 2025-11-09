import GetAllUsers from '../../application/use-cases/getAllUsers.js';
import GetUserById from '../../application/use-cases/getUserById.js';
import UpdateUser from '../../application/use-cases/updateUser.js';
import DeleteUser from '../../application/use-cases/deleteUser.js';
import UserRepository from '../database/userRepository.js';

const userRepository = new UserRepository();

const handleHttpError = (res, error) => {
  console.error(error);
  if (error.isOperational) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

class UserController {
  async getAllUsers(req, res) {
    try {
      const getAllUsers = new GetAllUsers(userRepository);
      const users = await getAllUsers.execute();
      res.json(users);
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async getUserById(req, res) {
    try {
      const getUserById = new GetUserById(userRepository);
      const user = await getUserById.execute({
        userId: req.params.id,
        requestingUser: req.user,
      });
      res.json(user);
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async updateUser(req, res) {
    try {
      const updateUser = new UpdateUser(userRepository);
      const user = await updateUser.execute({
        userId: req.params.id,
        data: req.body,
        requestingUser: req.user,
      });
      res.json({ message: 'Usuario actualizado', user });
    } catch (error) {
      handleHttpError(res, error);
    }
  }

  async deleteUser(req, res) {
    try {
      const deleteUser = new DeleteUser(userRepository);
      await deleteUser.execute({
        userId: req.params.id,
        requestingUser: req.user,
      });
      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      handleHttpError(res, error);
    }
  }
}

export default new UserController();