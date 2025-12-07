// Logging middleware
export const logger = (req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

// 404 handler
export const notFound = (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path
    });
};
