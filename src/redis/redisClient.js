// // redisClient.js
// import Redis from 'ioredis';

// // // Create a new Redis client for AWS ElastiCache
// // const redisClient = new Redis({
// //     host: 'master.my-redis.mct9gx.use1.cache.amazonaws.com', // Your ElastiCache primary endpoint
// //     port: 6379,                                               // Redis server port
// //     password: 'f3a9b7c2d4e5a1b8',                           // Your Redis password
// //     tls: {}                                                  // Enable TLS for secure connection
// // });


// // Create a new Redis client for local development
// const redisClient = new Redis({
//     host: '127.0.0.1',  // Localhost for development
//     port: 6379          // Default Redis port
// });

// // Handle connection events
// redisClient.on('connect', () => {
//     console.log('Connected to Redis');
// });

// // Handle readiness event
// redisClient.on('ready', () => {
//     console.log('Redis is ready to use...');
// });

// // Handle errors
// redisClient.on('error', (err) => {
//     console.error('Redis error:', err);
// });

// // Handle disconnection event
// redisClient.on('end', () => {
//     console.error('Client disconnected from Redis');
// });

// // Graceful shutdown on SIGINT
// process.on('SIGINT', () => {
//     redisClient.quit();
// });

// export default redisClient;
