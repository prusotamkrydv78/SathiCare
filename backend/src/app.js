import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import periodRoutes from './routes/periodRoutes.js';
import pregnancyRoutes from './routes/pregnancyRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { logger, errorHandler, notFound } from './middlewares/common.js';

// Load environment variables


// Connect to MongoDB
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// CORS configuration - Allow all origins for development
app.use(cors({
    origin: true, // Allow all origins
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger middleware
app.use(logger);

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Saathi Backend API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/period', periodRoutes);
app.use('/api/pregnancy', pregnancyRoutes);
app.use('/api', testRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
