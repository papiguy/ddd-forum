
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import { authConfig, isProduction } from '../../../../config';

const port = Number(authConfig.redisServerPort);
const host = authConfig.redisServerURL;

const redisConnection: RedisClientType = isProduction
  ? createClient({ url: authConfig.redisConnectionString })
  : createClient({ socket: { host, port } });

redisConnection.on('connect', () => {
  console.log(`[Redis]: Connected to redis server at ${host}:${port}`)
});

// Connect the client
redisConnection.connect().catch(console.error);

export { redisConnection }
