import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class RegisterUser {
  /**
   * @param {import('../repositories/iUserRepository.js').IUserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the use case.
   * @param {object} input
   * @param {string} input.name
   * @param {string} input.email
   * @param {string} input.password
   * @param {string} [input.role]
   * @returns {Promise<{user: object, token: string}>}
   */
  async execute({ name, email, password, role }) {
    // 1. Verify if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      // In a real app, you might want a more specific error type
      throw new Error('El email ya está registrado');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save user
    // The repository is responsible for creating the full user object.
    const newUser = await this.userRepository.save({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // 4. Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // 5. Return user and token
    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };
  }
}
