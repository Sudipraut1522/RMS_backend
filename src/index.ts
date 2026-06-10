import "reflect-metadata";
import app from './app.js';
import { config } from './config/index.js';
import { AppDataSource } from './config/db.js';
import { logger } from './utils/logger.js';

const PORT = config.port;

const startServer = async () => {
  try {
    // 1. Initialize TypeORM Data Source (connects to database and synces schemas)
    logger.info('Initializing TypeORM Data Source...');
    await AppDataSource.initialize();
    logger.info('Database connection established and tables synchronized.');

    // Seed the database with default records if empty
    const { seedDatabase } = await import('./config/seeder.js');
    await seedDatabase();

    // 2. Start listening
    const server = app.listen(PORT, () => {
      logger.info(`Server is running in ${config.env} mode on port ${PORT}`);
    });

    // 3. Graceful Shutdown management
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        try {
          await AppDataSource.destroy();
          logger.info('TypeORM connection destroyed.');
          process.exit(0);
        } catch (dbError) {
          logger.error('Error destroying TypeORM connection:', dbError);
          process.exit(1);
        }
      });

      // Force close if shutdown takes too long
      setTimeout(() => {
        logger.error('Force shutdown triggered due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
