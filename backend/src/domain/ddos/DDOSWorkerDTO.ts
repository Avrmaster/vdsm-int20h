import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class DDOSTaskDTO {
	@IsString()
	ipAddressOrDomain!: string
	@IsInt()
	@Min(0)
	requestsCount!: number
}

export class DDOSWorkerDTO {
	@IsString()
	public readonly uuid!: string

	@IsString()
	public readonly readableName!: string

	@IsInt()
	@Min(0)
	public readonly processesCount!: number

	@IsOptional()
	@IsString()
	public readonly password?: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => DDOSTaskDTO)
	public readonly executedTasks!: DDOSTaskDTO[]
}

export class DDOSWorker {
	public constructor(public readonly props: DDOSWorkerDTO, public readonly lastActive: string) {}
}
