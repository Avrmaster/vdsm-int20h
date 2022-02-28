import { fluentProvide } from 'inversify-binding-decorators'
import { inject } from 'inversify'
import { createClient, RedisClient } from 'redis'

import { CONFIG } from 'config'

// prettier-ignore
@fluentProvide(RedisProvider)
	.inSingletonScope()
	.done()
export class RedisProvider {
	public genClient(): RedisClient {
		return createClient({
			...CONFIG.redis,
			// setting this to maintain meaningful error handling 🤷‍
			retry_strategy: () => null,
		})
	}
}

// prettier-ignore
@fluentProvide(Redis)
	.inSingletonScope()
	.done()
export class Redis {
	private readonly _client_pub: RedisClient
	private readonly _client_sub: RedisClient

	public constructor(
		@inject(RedisProvider) provider: RedisProvider
	) {
		this._client_pub = provider.genClient()
		this._client_sub = provider.genClient()

		// setting this to prevent process.exit upon errors
		this._client_pub.on('error', (...args) => console.error(...args))
		this._client_sub.on('error', (...args) => console.error(...args))

		// subscribers
		this._client_sub.config("SET", "notify-keyspace-events", "Ex");
		this._client_sub.subscribe("__keyevent@0__:expired")
	}

	private async withPromise<T = any[]>(
		withCb: (cb: (e: Error | null, v: any) => any | void) => any | void,
	) {
		return new Promise<T>((resolve, reject) => {
			withCb((e: Error | null, v: T) => (e ? reject(e) : resolve(v)))
		})
	}

	async get(key: string): Promise<string | null> {
		return this.withPromise<string | null>((cb) => this._client_pub.get(key, cb))
	}

	async set(key: string, value: string, ttl?: number): Promise<void> {
		return this.withPromise<void>((cb) => {
			if (ttl) {
				this._client_pub.set(key, value, 'EX', ttl, cb)
			} else {
				this._client_pub.set(key, value, cb)
			}
		})
	}

	public subscribeExpired(onExpired: (event: string, key: string) => void) {
		this._client_sub.on('message', onExpired)
	}
}
