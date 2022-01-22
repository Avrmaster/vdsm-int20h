import { fluentProvide } from 'inversify-binding-decorators'
import { inject } from 'inversify'
import http from 'http'

import { ExpressApp } from './expressApp'
import { CONFIG } from 'config'

// prettier-ignore
@fluentProvide(RestServer)
	.inSingletonScope()
	.done()
export class RestServer {
	@inject(ExpressApp)
	private readonly expressApp!: ExpressApp

	public server: http.Server | null = null

	public start() {
		this.server = http.createServer(this.expressApp.app)
		this.server.on('error', RestServer.onError.bind(this))
		this.server.on('listening', this.onListening.bind(this))
		this.server.listen(CONFIG.rest.port)
	}

	public async stop() {
		return new Promise<void>((resolve, reject) => {
			this.server?.close((err) => {
				if (err) reject(err)
				resolve()
			})
		})
	}

	private static onError(error: any) {
		if (error.syscall !== 'listen') {
			throw error
		}

		const bind = 'Port ' + CONFIG.rest.port

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES':
				console.error(bind + ' requires elevated privileges')
				process.exit(1)
				break
			case 'EADDRINUSE':
				console.error(bind + ' is already in use')
				process.exit(1)
				break
			default:
				throw error
		}
	}

	private onListening() {
		const addr = this.server?.address()
		const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
		console.log('Listening on ' + bind)
	}
}
