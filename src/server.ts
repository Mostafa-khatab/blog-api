/**
 * Node modules
 *
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom modules
 */
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import { logger } from '@/lib/winston';

/**
 * Router
 */
import v1Router from '@/routes/v1';

/**
 * Types
 */

import type { CorsOptions } from 'cors';

/**
 * Express app initial
 */
const app = express();

// Configure CORS options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: ${origin} not allowed by CORS`), false);
      logger.warn(`CORS Error: ${origin} not allowed by CORS`);
    }
  },
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Enable JSON request body parsing
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode
// `extended: true` allows rich objects and arrays via querystring library
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Enable response compression to reduce payload size improve performance
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  }),
);

// Use Helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security

app.use(limiter);

(async () => {
  try {
    await connectToDatabase();

    app.use('/api/v1', v1Router);

    app.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start the server', err);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

/**
 * Handles server shutdown gracefully by disconnecting from the database.
 *
 * - Attempts to disconnect from the database before shutting down the server.
 *
 * - Logs a success message if the disconnection is successful,
 * - If an error occurs during disconnection, it is logged to the console .
 * - Exits the process with status code `0` (indicating successful shutdown)
 */

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn('Server SHUTDOWN');
    process.exit(0);
  } catch (err) {
    logger.error('Failed to shutdown server', err);
  }
};

/**
 * Listens for termination signals (`SIGTERM` and `SIGINT`),
 *
 * - `SIGTERM` is typically sent when stopping a process (e.g., `kill` command or container shutdown).
 * - `SIGINT` is triggered when the user interrupts the process (e.g., pressing Ctrl+C).
 * - When either signal is received, the `handleServerShutdown` is executed to ensure proper cleanup.
 */
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
