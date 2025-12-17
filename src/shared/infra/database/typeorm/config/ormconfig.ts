import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const {
  DDD_FORUM_DB_TYPE,         // NEW: 'mysql' | 'postgres' | 'mongodb'
  DDD_FORUM_DB_USER,
  DDD_FORUM_DB_PASS,
  DDD_FORUM_DB_HOST,
  DDD_FORUM_DB_PORT,
  DDD_FORUM_DB_DEV_DB_NAME,
  DDD_FORUM_DB_TEST_DB_NAME,
  DDD_FORUM_DB_PROD_DB_NAME,
  NODE_ENV,
  DDD_FORUM_IS_PRODUCTION,
  CLEARDB_DATABASE_URL,      // MySQL production URL (e.g., Heroku ClearDB)
  DATABASE_URL               // PostgreSQL/MongoDB production URL
} = process.env;

const dbType = (DDD_FORUM_DB_TYPE || 'mysql') as 'mysql' | 'postgres' | 'mongodb';
const isProduction = DDD_FORUM_IS_PRODUCTION === 'true';
const environment = NODE_ENV || 'development';

// Database name selection
const databaseName = isProduction
  ? DDD_FORUM_DB_PROD_DB_NAME
  : environment === 'test'
    ? DDD_FORUM_DB_TEST_DB_NAME
    : DDD_FORUM_DB_DEV_DB_NAME;

// Base configuration common to all databases
const baseConfig = {
  synchronize: false,  // Never auto-sync in production - use migrations
  logging: !isProduction,
  entities: [path.join(__dirname, '../entities/**/*.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')],
  subscribers: [path.join(__dirname, '../subscribers/**/*.{ts,js}')],
};

// MySQL/PostgreSQL configuration
const getRelationalConfig = (): DataSourceOptions => {
  // Production with connection URL
  if (isProduction && (DATABASE_URL || CLEARDB_DATABASE_URL)) {
    const url = dbType === 'postgres' ? DATABASE_URL : CLEARDB_DATABASE_URL;
    return {
      type: dbType as 'mysql' | 'postgres',
      url,
      ...baseConfig,
      // SSL for production databases (especially PostgreSQL on Heroku)
      ssl: dbType === 'postgres' ? { rejectUnauthorized: false } : undefined,
    } as DataSourceOptions;
  }

  // Development/Test with credentials
  return {
    type: dbType as 'mysql' | 'postgres',
    host: DDD_FORUM_DB_HOST || 'localhost',
    port: DDD_FORUM_DB_PORT ? parseInt(DDD_FORUM_DB_PORT) : (dbType === 'postgres' ? 5432 : 3306),
    username: DDD_FORUM_DB_USER,
    password: DDD_FORUM_DB_PASS,
    database: databaseName,
    ...baseConfig,
    // Connection pool settings
    extra: {
      max: 5,
      min: 0,
      idleTimeoutMillis: 10000,
    }
  } as DataSourceOptions;
};

// MongoDB configuration
const getMongoConfig = (): DataSourceOptions => {
  const mongoUrl = isProduction && DATABASE_URL
    ? DATABASE_URL
    : `mongodb://${DDD_FORUM_DB_HOST || 'localhost'}:${DDD_FORUM_DB_PORT || '27017'}/${databaseName}`;

  return {
    type: 'mongodb',
    url: mongoUrl,
    ...baseConfig,
  } as DataSourceOptions;
};

// Select configuration based on database type
const config = dbType === 'mongodb' ? getMongoConfig() : getRelationalConfig();

console.log(`[DB]: Connecting to ${dbType} database in ${isProduction ? 'production' : environment} mode.`);

export const AppDataSource = new DataSource(config);
