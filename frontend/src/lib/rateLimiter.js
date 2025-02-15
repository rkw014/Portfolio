import Redis from 'ioredis';

// Initialize Redis client using the REDIS_URL environment variable
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379/1");


export async function rateLimiter(ip) {
  if (!ip) return { error: 'IP_NOT_FOUND' };

  const key = `rate_limiter:${ip}`;
  const current = await redis.incr(key);
  
  if (current === 1) await redis.expire(key, 60); // 60秒窗口
  if (current > 10) return { error: 'RATE_LIMITED' }; // 每分钟10次

  return { success: true };
}