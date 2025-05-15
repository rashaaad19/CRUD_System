const jwt = require('jsonwebtoken');
const util = require('util');

const jwtVerify = util.promisify(jwt.verify);

const auth = async (req, res, next) => {
    try {

        //* Get the authorizattion key from request header and check if correct
        const tokenData = req.headers.authorization;
            if (!tokenData) {
                const err = new Error('Unauthorized: Token not provided');
                err.statusCode = 401;
                throw err;
            }
        //* Extract the JWT itself and decode it
        const token = tokenData.split(" ")[1];
        const decodedData = await jwtVerify(token, process.env.JWT_SECRET_KEY)
        //* Attach custom user object to the request, to know who made the request
        req.user = {
            _id: decodedData._id,
            role: decodedData.role,
        }

        next();
    }
    catch (err) {
        next(err);

    }

}



module.exports = auth;