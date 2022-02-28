import { provide } from 'inversify-binding-decorators'
import { inject } from 'inversify'

import { DDOSWorker, DDOSWorkerDTO } from 'domain/ddos/DDOSWorkerDTO'

import { Database } from 'infrastructure/db'

@provide(DDOSWorkerManager)
export class DDOSWorkerManager {
	@inject(Database)
	private readonly database!: Database

	public async upsertWorker(worker: DDOSWorkerDTO): Promise<DDOSWorker> {
		return null as any
	}

	public async getActiveWorkers(): Promise<DDOSWorker[]> {
		return []
	}

	public async getActiveTasks(): Promise<string[]> {
		return []
	}
}
