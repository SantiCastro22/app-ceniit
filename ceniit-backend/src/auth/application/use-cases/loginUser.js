import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class LoginUser {
  /**
   * @param {import('../repositories/iUserRepository.js').IUserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the use case.
   * @param {object} input
   * @param {string} input.email
   * @param {string} input.password
   * @returns {Promise<{user: object, token: string}>}
   */
  async execute({ email, password }) {
    // 1. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // 2. Compare passwords
    // console.log('Comparing passwords for user:', user.password, 'and input:', password);
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   throw new Error('Credenciales inválidas');
    // }

    // 3. Check user status
    if (user.status === 'inactive') {
      throw new Error('Usuario inactivo');
    }

    // 4. Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // 5. Return user and token
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
