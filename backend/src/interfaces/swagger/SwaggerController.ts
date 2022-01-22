import { ContextRequest, GET, Path } from 'typescript-rest'
import { provide } from 'inversify-binding-decorators'
import * as SwaggerUI from 'swagger-ui-express'
import { Tags } from 'typescript-rest-swagger'
import { Request } from 'express'
import fs from 'fs'
import path from 'path'

@Path('swagger')
@Tags('swagger')
@provide(SwaggerController)
export class SwaggerController {
	private readonly jsonPath = path.join(__dirname, 'temp', 'swagger.json')

	@GET
	@Path('json')
	public async getJSON(@ContextRequest req: Request): Promise<object> {
		const swaggerJSON = JSON.parse(fs.readFileSync(this.jsonPath).toString('utf-8'))
		swaggerJSON.host = req.get('host')
		return swaggerJSON
	}

	@GET
	public async getUI(@ContextRequest req: Request): Promise<string> {
		return SwaggerUI.generateHTML(await this.getJSON(req))
	}
}
