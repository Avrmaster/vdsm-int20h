import { AppException } from 'domain/exceptions/AppException'
import { NOT_FOUND } from 'http-codes'

export class WorkerNotFoundException extends AppException {
	public constructor(uuid: string | string[]) {
		super(NOT_FOUND, "Worker with given UUID wasn't found", { uuid })
	}
}
