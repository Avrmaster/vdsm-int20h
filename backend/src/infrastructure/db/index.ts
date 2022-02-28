import { fluentProvide } from 'inversify-binding-decorators'
import { Pool, PoolClient, QueryResult } from 'pg'
import { inject, injectable } from 'inversify'

import { CONFIG } from 'config'
import { container } from 'inversify.config'

// prettier-ignore
@fluentProvide(PoolProvider)
	.inSingletonScope()
	.done()
export class PoolProvider {
	readonly pool: Pool

	constructor() {
		this.pool = new Pool(CONFIG.db)
	}
}

@injectable()
export class Database {
	@inject(PoolProvider)
	private readonly poolProvider!: PoolProvider

	private transactionClient?: PoolClient
	private transactionFormingPromise?: Promise<any>

	public async exec<T>(action: (client: PoolClient) => Promise<T>): Promise<T> {
		if (this.transactionClient) {
			return action(this.transactionClient)
		} else {
			const client = await this.poolProvider.pool.connect()
			try {
				return await action(client)
			} finally {
				client.release()
			}
		}
	}

	public async query<T>(queryText: string, values?: any[]): Promise<T[]> {
		return this.exec<T[]>((client) =>
			client.query(queryText, values).then((res: QueryResult<T>) => res.rows),
		)
	}

	public async wrapIntoTransaction<T>(f: () => Promise<T>): Promise<T> {
		if (!this.transactionFormingPromise) {
			this.transactionFormingPromise = (async () => {
				this.transactionClient = await this.poolProvider.pool.connect()
				await this.query('BEGIN TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;')
			})()
		}

		// waiting for transaction to begin
		await this.transactionFormingPromise

		try {
			const fRes = await f()
			await this.query('COMMIT')

			return fRes
		} catch (e) {
			await this.query('ROLLBACK')
			throw e
		} finally {
			if (this.transactionClient) {
				;(this.transactionClient as PoolClient).release()
			}
			delete this.transactionClient
			delete this.transactionFormingPromise
		}
	}
}

container.bind(Database).to(Database).inRequestScope()
