import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// import authRoutes from './routes/auth.js'; // Replaced by new architecture
import authRouter from './src/auth/index.js';
// import userRoutes from './routes/users.js'; // Replaced by new architecture
import userRouter from './src/users/index.js';
import resourceRouter from './src/resources/index.js';
// import reservationRoutes from './routes/reservations.js'; // Replaced by new architecture
import reservationRouter from './src/reservations/index.js';
import projectRouter from './src/projects/index.js';

dotenv.config();

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API v1 Router
const apiV1Router = express.Router();

// Mount feature routers
apiV1Router.use('/auth', authRouter);
apiV1Router.use('/users', userRouter);
apiV1Router.use('/resources', resourceRouter);
apiV1Router.use('/reservations', reservationRouter);
apiV1Router.use('/projects', projectRouter);

// Health check for v1
apiV1Router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount the v1 router
app.use('/', apiV1Router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Error interno del servidor' 
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
    Servidor CENIIT iniciado         
    Puerto: ${PORT}                     
    Entorno: ${process.env.NODE_ENV || 'development'}
  `);
});