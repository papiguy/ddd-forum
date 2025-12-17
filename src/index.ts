// TypeORM requires reflect-metadata
import "reflect-metadata";

// Initialize database first, then start the app
(async () => {
  try {
    // Initialize database connection and wait for it to complete
    const { dbInitPromise } = await import("./shared/infra/database/typeorm");
    await dbInitPromise;

    // Then start the HTTP app
    await import("./shared/infra/http/app");

    // Load subscriptions
    await import("./modules/forum/subscriptions");
  } catch (error) {
    console.error('[App]: Failed to start:', error);
    process.exit(1);
  }
})();
