import jwt from 'jsonwebtoken'
import createError from "http-errors"
import dotenv from 'dotenv'


dotenv.config()


const signAccessToken = (userId) => {

    return new Promise((resolve, reject) => {
        // Define the payload with user-specific data
        const payload = {
            userId, // Including the userId as the payload
        };

        // Secret key for signing the token
        const secret = process.env.ACCESS_TOKEN_SECRET;

        // Options for the token: setting the audience (the user), and the expiry time
        const options = {
            expiresIn: '35s', // You can increase this if needed
            audience: userId,  // Ensuring the token is intended for the specific user
        };

        // Generate the token
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.error('Error signing token: ', err);
                return reject(createError.InternalServerError('Failed to generate token.'));
            }
            resolve(token); // Return the generated token
        });
    });
};



export const verifAccessToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']; // Ensure headers are accessed in lowercase

    // Check if Authorization header is present
    if (!authHeader) return next(createError.Unauthorized("Authorization header missing"));

    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    // Check if token exists
    if (!token) return next(createError.Unauthorized("Token not found"));

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            // if (err.name === 'JsonWebTokenError') {
            //     return next(createError.Unauthorized());
            // } else {
            //     return next(createError.Unauthorized(err.message));
            // }
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
            return next(createError.Unauthorized(message))

        }
        req.payload = payload;
        next();
    });
};


export const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
        };
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: '1d',
            audience: userId
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err)
                reject(createError.InternalServerError())
            }
            // //set the refreshToken as a KEY:VALUE pair in redis for perticular period of time
            // redisClient.set(userId, token, 'EX', 60 * 60 * 24 * 365, (err, reply) => {
            //     if (err) {
            //         console.log(err.message)
            //         reject(createError.InternalServerError())
            //         return
            //     }
            //     
            // })


            resolve(token);
        });
    });
};


export const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return reject(createError.Unauthorized('Refresh token has expired.'));
                }
                // For other errors, like invalid signature
                return reject(createError.Unauthorized('Invalid refresh token.'));
            }
            resolve(payload.aud); // 'aud' should contain the userId
        });
    });
};



export default signAccessToken
