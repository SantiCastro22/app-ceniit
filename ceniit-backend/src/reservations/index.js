import pool from '../../config/database.js';

// Repositories from different modules
import { UserRepository } from '../auth/infrastructure/database/userRepository.js';
import { ResourceRepository } from '../resources/infrastructure/database/resourceRepository.js';
import { ReservationRepository } from './infrastructure/database/reservationRepository.js';

// Shared Middleware
import { AuthMiddleware } from '../auth/infrastructure/http/middlewares/auth.middleware.js';

// Local Use Cases
import { GetAllReservations } from './application/use-cases/getAllReservations.js';
import { CreateReservation } from './application/use-cases/createReservation.js';
import { UpdateReservationStatus } from './application/use-cases/updateReservationStatus.js';

// Local Controller and Router factory
import { ReservationController } from './infrastructure/http/reservation.controller.js';
import { createReservationRouter } from './infrastructure/http/reservation.routes.js';

// --- DEPENDENCY INJECTION CONTAINER for Reservations Module ---

// 1. Instantiate all necessary repositories.
const userRepository = new UserRepository(pool);
const resourceRepository = new ResourceRepository(pool);
const reservationRepository = new ReservationRepository(pool);

// 2. Instantiate shared middleware.
const authMiddleware = new AuthMiddleware(userRepository);

// 3. Instantiate local use cases, injecting their repository dependencies.
const getAllReservations = new GetAllReservations(reservationRepository);
const createReservation = new CreateReservation(reservationRepository, resourceRepository);
const updateReservationStatus = new UpdateReservationStatus(reservationRepository);

// 4. Instantiate the local controller, injecting the use cases.
const reservationController = new ReservationController(
  getAllReservations,
  createReservation,
  updateReservationStatus
);

// 5. Create and configure the router.
const reservationRouter = createReservationRouter({ reservationController, authMiddleware });

// 6. Export the final router.
export default reservationRouter;
