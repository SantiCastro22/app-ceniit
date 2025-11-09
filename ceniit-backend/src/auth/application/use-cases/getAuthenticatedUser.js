export class GetAuthenticatedUser {
  /**
   * @param {import('../repositories/iUserRepository.js').IUserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the use case.
   * @param {object} input
   * @param {string} input.userId - The ID of the user to retrieve.
   * @returns {Promise<object>}
   */
  async execute({ userId }) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      // This case should be rare if the token is properly validated beforehand,
      // but it's a crucial safeguard.
      throw new Error('Usuario no encontrado');
    }

    // Return a DTO (Data Transfer Object) of the user, excluding sensitive info
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }
}
