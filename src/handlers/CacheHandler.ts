import Redis from 'redis';
import { promisify } from 'util';
import OriginClient from '../lib/OriginClient';
export default class CacheHandler {
	private connection: Redis.RedisClient;
	private bot: OriginClient;

	constructor(bot: OriginClient) {
        const start = Date.now();
		this.bot = bot;
		if (
			!process.env.CACHE_HOST ||
			!process.env.CACHE_PORT ||
			!process.env.CACHE_PASS
		)
            throw new Error('Missing Redis Cache Data');
            
		this.connection = Redis.createClient({
            host: process.env.CACHE_HOST,
            port: 10877,
            password: process.env.CACHE_PASS
        }
		);
		
        console.log(`Loaded Cache in ${Date.now() - start}ms`);

	}
	
	public get (key: string): Promise<string|null> {
		const getAsync = promisify(this.connection.get).bind(this.connection)

		return getAsync(key)
	}

	public set (key: string, value: string): Promise<unknown> {
		const setAsync = promisify(this.connection.set).bind(this.connection)

		return setAsync(key, value)
	}

	public delete (key: string): boolean {

		return this.connection.del(key)
	}
    
}
