// Utility functions

export const formatResponse = (data, message = 'Success') => {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};

export const formatError = (error, message = 'Error occurred') => {
    return {
        success: false,
        message,
        error: error.message || error,
        timestamp: new Date().toISOString()
    };
};
