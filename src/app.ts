import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { NotFoundError } from './errors/NotFoundError.js';

const app = express();

app.use(cors());
app.use(express.json());

// Request logger middleware
app.use(requestLogger);

// Register Main API Routes
app.use('/api', apiRouter);

// Fallback for 404 Route Not Found
app.use('*', (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Centralized Global Error Handler Middleware
app.use(errorHandler);

export default app;
