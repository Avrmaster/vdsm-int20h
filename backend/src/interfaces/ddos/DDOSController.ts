import { provide } from 'inversify-binding-decorators'
import { POST, Path, GET, QueryParam } from 'typescript-rest'
import { Tags } from 'typescript-rest-swagger'
import { inject } from 'inversify'

import { DDOSWorker, DDOSWorkerDTO } from 'domain/ddos/DDOSWorkerDTO'

import { DDOSWorkerRepository } from 'infrastructure/repositories/DDOSWorkerRepository'

import { ValidateBody } from 'interfaces/validators'

@Tags('DDOSCluster')
@Path('/')
@provide(DDOSController)
export class DDOSController {
	@inject(DDOSWorkerRepository)
	private readonly repo!: DDOSWorkerRepository

	@POST
	@Path('submit-progress')
	@ValidateBody(DDOSWorkerDTO)
	public async upsertWorker(body: DDOSWorkerDTO): Promise<DDOSWorker> {
		return this.repo.upsertWorker(body)
	}

	@GET
	@Path('active-workers')
	public async getActiveWorkers(
		@QueryParam('minutesInterval') minutesInterval = 10,
	): Promise<DDOSWorker[]> {
		return this.repo.getActiveWorkers(minutesInterval)
	}

	@GET
	@Path('active-tasks')
	public async getActiveTasks(): Promise<string[]> {
		return this.repo.getActiveTasks()
	}
}
