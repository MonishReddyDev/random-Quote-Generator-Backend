import jwt from 'jsonwebtoken'
import createError from "http-errors"
import dotenv from 'dotenv'
import redisClient from '../redis/redisClient.js';

dotenv.config()


const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
        };
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: '35s',
            audience: userId
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err)
                reject(createError.InternalServerError())
            }
            resolve(token);
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
            expiresIn: '1y',
            audience: userId
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err)
                reject(createError.InternalServerError())
            }
            //set the refreshToken as a KEY:VALUE pair in redis for perticular period of time
            redisClient.set(userId, token, 'EX', 60 * 60 * 24 * 365, (err, reply) => {
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                    return
                }
                resolve(token);
            })

        });
    });
};

export const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {

            if (err) throw reject(createError.Unauthorized())

            const userId = payload.aud

            //Get the token form redis and compare it with the token comming as a parameter
            redisClient.get(userId, (err, result) => {
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                    return
                }
                if (refreshToken === result) {
                    return resolve(userId)
                }
                reject(createError.Unauthorized())
            })
        })
    })

}


export default signAccessToken
