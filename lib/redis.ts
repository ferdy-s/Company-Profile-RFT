import Redis, { type RedisOptions } from 'ioredis';
import { env } from './env';

let redisClient: Redis | null = null;

/** When unset, the app must not open a connection to localhost:6379 (avoids blog crashes without Redis). */
export function isRedisConfigured(): boolean {
  return !!(env.REDIS_URL?.trim() || env.REDIS_HOST?.trim());
}

/**
 * Get or create a Redis/DragonflyDB client instance.
 * DragonflyDB is Redis-compatible and uses the same connection protocol.
 * 
 * Connection URL format: redis://:password@host:port
 */
export function getRedisClient(): Redis {
  if (!isRedisConfigured()) {
    throw new Error('Redis is not configured (set REDIS_URL or REDIS_HOST)');
  }

  if (redisClient) {
    return redisClient;
  }

  const redisUrl = env.REDIS_URL;
  const redisPassword = env.REDIS_PASSWORD;

  // Configuration for Redis/DragonflyDB connection
  // DragonflyDB is fully Redis-compatible, so ioredis works seamlessly
  const redisConfig: RedisOptions = {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    // Enable keep-alive for better connection stability
    keepAlive: 30000,
  };

  // Add password to config if provided (for non-URL connections)
  if (redisPassword) {
    redisConfig.password = redisPassword;
  }

  // Connect using URL if provided (recommended format includes password)
  // Format: redis://:password@host:port
  if (redisUrl) {
    redisClient = new Redis(redisUrl, redisConfig);
  } else {
    redisClient = new Redis({
      host: env.REDIS_HOST!,
      port: env.REDIS_PORT || 6379,
      ...redisConfig,
    });
  }

  redisClient.on('error', (err) => {
    console.error('DragonflyDB/Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('DragonflyDB/Redis Client Connected');
  });

  redisClient.on('ready', () => {
    console.log('DragonflyDB/Redis Client Ready');
  });

  return redisClient;
}

/**
 * Close the Redis/DragonflyDB connection gracefully
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

