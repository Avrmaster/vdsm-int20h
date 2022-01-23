import { provide } from 'inversify-binding-decorators'
import { ContextRequest, GET, Path, PathParam, POST } from 'typescript-rest'
import { inject } from 'inversify'
import { Request } from 'express'

import { ValidationException } from 'domain/exceptions'
import { JitsiAccess } from 'domain/jitsi/Jitis.dto'

import { JitsiManager } from 'application/jitsi/JitsiManager'

@Path('jitsi')
@provide(JitsiController)
export class JitsiController {
	@inject(JitsiManager)
	private readonly jitsiManager!: JitsiManager

	@POST
	@Path('create')
	public async createMeeting(): Promise<JitsiAccess> {
		return this.jitsiManager.createMeeting()
	}

	@POST
	@Path('invite')
	public async createMeetingInvite(@ContextRequest req: Request): Promise<JitsiAccess> {
		const authorization = req.header('Authorization')
		if (!authorization) {
			throw new ValidationException({ header: { authorization: 'Not provided' } })
		}
		const [, jwt] = authorization.split(' ')
		if (!jwt) {
			throw new ValidationException({ header: { authorization: 'JWT Not provided' } })
		}

		return this.jitsiManager.createMeetingInvite(jwt)
	}

	@GET
	@Path(':alias')
	public async getAccess(@PathParam('alias') alias: string): Promise<JitsiAccess> {
		return this.jitsiManager.getAccess(alias)
	}
}
