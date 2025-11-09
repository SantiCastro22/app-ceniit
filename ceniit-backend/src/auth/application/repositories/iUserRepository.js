// This file defines the interface (a contract) for user repositories.
// Any data storage implementation (like PostgreSQL, MongoDB, etc.) must adhere to this contract.
// This is an "output port" in Clean Architecture.

export class IUserRepository {
  /**
   * Finds a user by their email address.
   * @param {string} email - The email of the user to find.
   * @returns {Promise<import('../../domain/user.js').User|null>} A promise that resolves to the User object or null if not found.
   */
  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Finds a user by their ID.
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<import('../../domain/user.js').User|null>} A promise that resolves to the User object or null if not found.
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Saves a new user to the data store.
   * @param {import('../../domain/user.js').User} user - The user object to save.
   * @returns {Promise<import('../../domain/user.js').User>} A promise that resolves to the created User object.
   */
  async save(user) {
    throw new Error('Method not implemented');
  }

  /**
   * Retrieves all users.
   * @returns {Promise<import('../../domain/user.js').User[]>} A promise that resolves to an array of User objects.
   */
  async findAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Updates a user's data.
   * @param {string} id - The ID of the user to update.
   * @param {object} data - An object containing the fields to update.
   * @returns {Promise<import('../../domain/user.js').User|null>} A promise that resolves to the updated User object or null if not found.
   */
  async update(id, data) {
    throw new Error('Method not implemented');
  }

  /**
   * Deletes a user by their ID.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful, false otherwise.
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }
}
