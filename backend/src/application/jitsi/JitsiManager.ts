import { provide } from 'inversify-binding-decorators'
import { inject } from 'inversify'
import { v4 as uuidv4 } from 'uuid'

import { JitsiAccess } from 'domain/jitsi/Jitis.dto'

import { JitsiSigner } from './JitsiSigner'
import { CONFIG } from 'config'
import { ValidationException } from 'domain/exceptions'

@provide(JitsiManager)
export class JitsiManager {
	@inject(JitsiSigner)
	private readonly jwt!: JitsiSigner

	public async createMeeting(): Promise<JitsiAccess> {
		return this.createJitsiAccess(uuidv4(), true)
	}

	public async createMeetingInvite(token: string): Promise<JitsiAccess> {
		const { creator, roomName } = await this.jwt.parsePayload<{
			creator: string
			roomName: string
		}>(token)
		if (!creator || !roomName) {
			throw new ValidationException({ role: 'You are not creator of this meeting' })
		}

		return this.createJitsiAccess(roomName, false)
	}

	private async createJitsiAccess(roomName: string, creator: boolean): Promise<JitsiAccess> {
		return {
			jwt: await this.jwt.signJitsi(roomName, { creator, roomName }),
			roomName: `${CONFIG.jitsi.appId}/${roomName}`,
		}
	}
}
