import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testRoutes from './routes/testRoutes.js';
import { logger, errorHandler, notFound } from './middlewares/common.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: 'SathiCare Backend API',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api', testRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
