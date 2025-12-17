
import type { RedisClientType } from 'redis'

export abstract class AbstractRedisClient {
  private tokenExpiryTime: number = 604800;
  protected client: RedisClientType;

  constructor (client: RedisClientType) {
    this.client = client;
  }

  public async count (key: string): Promise<number> {
    const allKeys = await this.getAllKeys(key);
    return allKeys.length;
  }

  public async exists (key: string): Promise<boolean> {
    const count = await this.count(key);
    return count >= 1;
  }

  public async getOne<T> (key: string): Promise<T> {
    const reply = await this.client.get(key);
    return reply as T;
  }

  public async getAllKeys(wildcard: string): Promise<string[]> {
    const results = await this.client.keys(wildcard);
    return results;
  }

  public async getAllKeyValue (wildcard: string): Promise<any[]> {
    const results = await this.client.keys(wildcard);
    const allResults = await Promise.all(
      results.map( async (key) => {
        const value = await this.getOne(key);
        return { key, value }
      })
    );
    return allResults;
  }

  public async set(key: string, value: any): Promise<any> {
    const reply = await this.client.set(key, value);
    await this.client.expire(key, this.tokenExpiryTime);
    return reply;
  }

  public async deleteOne (key: string): Promise<number> {
    const reply = await this.client.del(key);
    return reply;
  }

  public async testConnection (): Promise<any> {
    await this.client.set('test', 'connected');
    return true;
  }
}

