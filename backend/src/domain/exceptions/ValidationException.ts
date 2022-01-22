import { AppException } from './AppException'

export class ValidationException extends AppException {
	constructor(errors: object) {
		super(400, 'Введені некоректні дані', errors)
	}
}
