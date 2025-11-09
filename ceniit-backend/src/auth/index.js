// This file is the entry point for the auth module.
// It's responsible for dependency injection (wiring up all the classes)
// and exporting the configured router.

import pool from '../../config/database.js';

// Import all the pieces from the different layers
import { UserRepository } from './infrastructure/database/userRepository.js';
import { RegisterUser } from './application/use-cases/registerUser.js';
import { LoginUser } from './application/use-cases/loginUser.js';
import { GetAuthenticatedUser } from './application/use-cases/getAuthenticatedUser.js';
import { AuthController } from './infrastructure/http/auth.controller.js';
import { AuthMiddleware } from './infrastructure/http/middlewares/auth.middleware.js';
import { createAuthRouter } from './infrastructure/http/auth.routes.js';

// --- DEPENDENCY INJECTION CONTAINER ---
// Here we instantiate our classes and inject their dependencies.

// 1. Infrastructure: Create a repository instance with the database pool.
const userRepository = new UserRepository(pool);

// 2. Application: Create use case instances with the repository.
const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository);
const getAuthenticatedUser = new GetAuthenticatedUser(userRepository);

// 3. Infrastructure: Create controller and middleware instances with their dependencies.
const authController = new AuthController(
  registerUser,
  loginUser,
  getAuthenticatedUser
);

const authMiddleware = new AuthMiddleware(userRepository);
// --- END OF CONTAINER ---

// 4. Infrastructure: Create the router and inject the controller and middleware.
const authRouter = createAuthRouter({ authController, authMiddleware });

// 5. Export the fully configured router for the server to use.
export default authRouter;
