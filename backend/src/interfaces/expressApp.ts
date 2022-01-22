import { provide } from 'inversify-binding-decorators'
import * as SwaggerUI from 'swagger-ui-express'
import { Server } from 'typescript-rest'
import cookieParser from 'cookie-parser'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'

import { InversifyServiceFactory } from './inversifyServiceFactory'
import { errorMiddleware } from './errorMiddleware'
import { CONFIG } from 'config'

@provide(ExpressApp)
export class ExpressApp {
	public readonly app: express.Application

	constructor() {
		this.app = express()
		this.app.use(cors({ origin: CONFIG.rest.corsOrigin }))
		this.app.use(logger('dev'))
		this.app.use(express.json())
		this.app.use(express.urlencoded({ extended: false }))
		this.app.use(cookieParser())
		// keep route the same as in SwaggerControllerUtils
		this.app.use('/swagger', SwaggerUI.serve)

		// making sure to support inversify container when loading controllers
		Server.registerServiceFactory(new InversifyServiceFactory())
		// inspect all annotations and add routes to app
		Server.buildServices(this.app)

		this.app.use(errorMiddleware())
	}
}
