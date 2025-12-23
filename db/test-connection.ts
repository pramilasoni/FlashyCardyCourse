// This is a test file to verify your database connection
// You can run this with: npx tsx db/test-connection.ts

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from './index';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Simple query to test connection
    const result = await db.execute(sql`SELECT NOW() as current_time, version() as pg_version`);
    
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();

