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
		this.pool= new Pool(CONFIG.db)
	}
}

@injectable()
export class Database {
	@inject(PoolProvider)
	private readonly poolProvider!: PoolProvider

	public async exec<T>(action: (client: PoolClient) => Promise<T>): Promise<T> {
		const client = await this.poolProvider.pool.connect()
		try {
			return await action(client)
		} finally {
			client.release()
		}
	}

	public async query<T>(queryText: string, values?: any[]): Promise<T[]> {
		return this.exec<T[]>((client) =>
			client.query(queryText, values).then((res: QueryResult<T>) => res.rows),
		)
	}
}

container.bind(Database).to(Database).inRequestScope()
