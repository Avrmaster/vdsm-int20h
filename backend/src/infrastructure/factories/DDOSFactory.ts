import { DDOSWorker } from 'domain/ddos/DDOSWorkerDTO'

export class DDOSFactory {
	public static fromRaw(raw: any, withPassword: boolean): DDOSWorker {
		return new DDOSWorker(
			{
				uuid: raw.uuid,
				readableName: raw.readable_name,
				password: withPassword ? raw.password : undefined,
				processesCount: raw.processes_count,
				executedTasks: (raw.tasks as any[])
					.filter((t) => !!t)
					.map((t) => ({
						ipAddressOrDomain: t.target,
						requestsCount: t.requests_count,
					})),
			},
			raw.last_active,
		)
	}
}
