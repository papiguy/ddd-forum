import 'reflect-metadata';
import { initializeDatabase } from './config/database-providers';

// Initialize database connection and export the promise
export const dbInitPromise = (async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('[DB]: Failed to initialize database:', error);
    process.exit(1);
  }
})();

export { getDataSource, closeDatabase } from './config/database-providers';
