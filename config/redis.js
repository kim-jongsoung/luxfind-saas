const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      console.error('Redis 에러:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis 연결 성공');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Redis 연결 실패:', error);
    return null;
  }
};

module.exports = { connectRedis, getRedisClient: () => redisClient };
