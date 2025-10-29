import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Conectado correctamente a BD PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error en la conexión a PostgreSQL:', err);
  process.exit(-1);
});

export default pool;
