export class IResourceRepository {
  /**
   * @returns {Promise<import('../../domain/resource.js').Resource[]>}
   */
  async getAll() {
    throw new Error('Method not implemented');
  }

  /**
   * @param {number} id
   * @returns {Promise<import('../../domain/resource.js').Resource|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {object} resourceData
   * @returns {Promise<import('../../domain/resource.js').Resource>}
   */
  async create(resourceData) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {number} id
   * @param {object} resourceData
   * @returns {Promise<import('../../domain/resource.js').Resource|null>}
   */
  async update(id, resourceData) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }
}
