// src/users/application/repositories/iUserRepository.js
class IUserRepository {
  constructor() {
    if (this.constructor === IUserRepository) {
      throw new Error("Can't instantiate abstract class!");
    }
  }

  /**
   * @returns {Promise<User[]>}
   */
  async getAll() {
    throw new Error("Method 'getAll()' must be implemented.");
  }

  /**
   * @param {number} id
   * @returns {Promise<User|null>}
   */
  async getById(id) {
    throw new Error("Method 'getById()' must be implemented.");
  }

  /**
   * @param {number} id
   * @param {object} userData
   * @returns {Promise<User|null>}
   */
  async update(id, userData) {
    throw new Error("Method 'update()' must be implemented.");
  }

  /**
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error("Method 'delete()' must be implemented.");
  }
}

export default IUserRepository;
