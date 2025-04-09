// Script to create the admin user in the database
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import ws from 'ws';

// Setup Neon database with WebSocket support
neonConfig.webSocketConstructor = ws;

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createAdmin() {
  try {
    console.log("Connecting to database...");
    // Check if admin already exists
    const checkResult = await pool.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );
    
    if (checkResult.rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    await pool.query(
      "INSERT INTO users (username, password, is_admin) VALUES ('admin', '5417562', true)"
    );
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await pool.end();
  }
}

createAdmin();