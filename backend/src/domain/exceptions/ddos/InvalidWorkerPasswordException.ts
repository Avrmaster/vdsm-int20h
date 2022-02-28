import { AppException } from 'domain/exceptions/AppException'
import { UNAUTHORIZED } from 'http-codes'

export class InvalidWorkerPasswordException extends AppException {
	public constructor(payload: any) {
		super(
			UNAUTHORIZED,
			'Your password does not match the one specified for this worker uuid',
			payload,
		)
	}
}
