import { provide } from 'inversify-binding-decorators'
import { inject } from 'inversify'
import { v4 as uuidv4 } from 'uuid'

import { CONFIG } from 'config'

import { ValidationException } from 'domain/exceptions'
import { JitsiAccess } from 'domain/jitsi/Jitis.dto'

import { JitsiSigner } from './JitsiSigner'

import { MeetingRepository } from 'infrastructure/repositories/MeetingRepository'

@provide(JitsiManager)
export class JitsiManager {
	@inject(JitsiSigner)
	private readonly jwt!: JitsiSigner
	@inject(MeetingRepository)
	private readonly repo!: MeetingRepository

	public async createMeeting(): Promise<JitsiAccess> {
		return this.createJitsiAccess(uuidv4(), true)
	}

	public async createMeetingInvite(jwtToken: string): Promise<JitsiAccess> {
		const { isCreator, roomName } = await this.jwt.parsePayload(jwtToken)

		if (!isCreator || !roomName) {
			throw new ValidationException({ role: 'You are not creator of this meeting' })
		}

		return this.createJitsiAccess(roomName, false)
	}

	public async getAccess(alias: string): Promise<JitsiAccess> {
		return this.repo.getAccess(alias)
	}

	private async createJitsiAccess(roomName: string, creator: boolean): Promise<JitsiAccess> {
		// copy to bd
		return this.repo.saveAccess({
			alias: uuidv4(),
			jwt: await this.jwt.signJitsi(roomName, creator),
			roomName: `${CONFIG.jitsi.appId}/${roomName}`, // roomName must be prefixed with appId for frontend
			isCreator: creator,
		})
	}
}
