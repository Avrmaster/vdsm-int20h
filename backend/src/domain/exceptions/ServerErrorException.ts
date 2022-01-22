import httpCodes from 'http-codes'

import { AppException } from './AppException'

export class ServerErrorException extends AppException {
	constructor(payload?: any) {
		super(
			httpCodes.INTERNAL_SERVER_ERROR,
			'Сталася внутрішня помилка сервера. Ми вже над цим працюємо!',
			payload,
		)
	}
}
