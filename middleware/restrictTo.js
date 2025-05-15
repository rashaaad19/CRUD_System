function restrictTo(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Forbidden',
                status: 'failed'
            })
        }
        next();
    }
}

module.exports = restrictTo;