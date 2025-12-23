import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Create a connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create the drizzle instance
export const db = drizzle(pool);

