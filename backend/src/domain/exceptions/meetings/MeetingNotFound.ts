import { NOT_FOUND } from 'http-codes'
import { AppException } from 'domain/exceptions/AppException'

export class MeetingNotFound extends AppException {
	public constructor(alias: string) {
		super(NOT_FOUND, 'Meeting was not found', { alias })
	}
}
