import { AppException } from './AppException'

export class HttpErrorException extends AppException {
	constructor(code: number, message: string, name: string, payload?: any) {
		super(code, message, payload, name)
	}
}
