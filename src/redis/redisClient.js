// redisClient.js
import Redis from 'ioredis';

// Create a new Redis client
const redisClient = new Redis({
    host: '127.0.0.1',  // Redis server host
    port: 6379,          // Redis server port
    // password: 'your_password', // Uncomment if your Redis server requires a password
    // db: 0,               // Default database index (optional)
});

// Handle connection events
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

export default redisClient;
