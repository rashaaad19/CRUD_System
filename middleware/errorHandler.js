jwt = require('jsonwebtoken');

const errorHandler = (err, req, res, next) => {
    //* Return JWT related error for JWT errors
    if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
            message: 'Invalid or expired token',
            status: 'failed',
        });
    }

    //* Return generic server error to other error typees        
    const status = err.statusCode || 500;
    res.status(status).json({
        message: err.message || 'Internal Server Error',
        status: 'failed',
    });
    
}

module.exports = errorHandler;