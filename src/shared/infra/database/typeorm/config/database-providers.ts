import { DataSource } from 'typeorm';
import { AppDataSource } from './ormconfig';

let dataSource: DataSource | null = null;

/**
 * Initialize the database connection
 * @returns Promise<DataSource>
 */
export const initializeDatabase = async (): Promise<DataSource> => {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  try {
    dataSource = await AppDataSource.initialize();
    console.log('[DB]: Data Source has been initialized successfully.');
    return dataSource;
  } catch (error) {
    console.error('[DB]: Error during Data Source initialization:', error);
    throw error;
  }
};

/**
 * Get the current DataSource instance
 * @returns DataSource
 * @throws Error if DataSource is not initialized
 */
export const getDataSource = (): DataSource => {
  if (!dataSource || !dataSource.isInitialized) {
    throw new Error('DataSource is not initialized. Call initializeDatabase() first.');
  }
  return dataSource;
};

/**
 * Close the database connection gracefully
 * @returns Promise<void>
 */
export const closeDatabase = async (): Promise<void> => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    console.log('[DB]: Data Source has been closed.');
    dataSource = null;
  }
};
