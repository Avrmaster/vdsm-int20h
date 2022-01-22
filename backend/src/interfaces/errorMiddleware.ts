import * as express from 'express'
import { HttpError } from 'typescript-rest/dist/server/model/errors'

import { ServerErrorException, HttpErrorException, AppException } from 'domain/exceptions'

function appExceptionResponse(err: AppException, res: express.Response) {
	res.setHeader('Content-Type', 'application/json')
	res.status(err.statusCode)
	res.json({ ...err })
}

export function errorMiddleware() {
	return function (
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) {
		if (err) {
			if (err instanceof AppException) {
				appExceptionResponse(err, res)
			} else if (err instanceof HttpError) {
				const { statusCode, message, name, ...payload } = err
				appExceptionResponse(new HttpErrorException(statusCode, message, name, payload), res)
			} else {
				appExceptionResponse(new ServerErrorException(`${err.toString?.()} ### ${err.stack}`), res)
			}
		} else {
			next(err)
		}
	}
}
