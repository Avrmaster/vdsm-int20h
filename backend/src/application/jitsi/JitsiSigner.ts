import { provide } from 'inversify-binding-decorators'
import { sign, verify } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

import { CONFIG } from 'config'
import path from 'path'
import { ValidationException } from 'domain/exceptions'

@provide(JitsiSigner)
export class JitsiSigner {
	private async getJitsiPK(): Promise<string> {
		return (await new Promise((resolve, reject) =>
			fs.readFile(path.join(__dirname, 'jitsi2.pk'), (err, res) => {
				if (err) {
					reject(err)
					return
				}

				resolve(res.toString('utf-8'))
			}),
		)) as string
	}

	public async signJitsi(roomName: string, isCreator: boolean): Promise<string> {
		const now = new Date()
		const jitsiPK = await this.getJitsiPK()

		return sign(
			{
				aud: 'jitsi',
				context: {
					user: {
						id: uuidv4(),
						name: 'int20 h',
						avatar: '',
						email: 'int20h@gmail.com',
						moderator: isCreator,
						instanceId: 'int20DEV',
					},
					features: {
						livestreaming: true,
						recording: true,
						transcription: true,
						'outbound-call': true,
					},
				},
				payload: { isCreator, roomName },
				iss: 'chat',
				room: roomName,
				sub: CONFIG.jitsi.appId,
				exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
				nbf: Math.round(new Date().getTime() / 1000) - 10,
			},
			jitsiPK,
			{ algorithm: 'RS256', header: { kid: CONFIG.jitsi.kid, alg: 'RS256' } },
		)
	}

	public async parsePayload(token: string): Promise<{ isCreator: boolean; roomName: string }> {
		const jitsiPK = await this.getJitsiPK()
		try {
			return (verify(token, jitsiPK, { algorithms: ['RS256'] }) as any)?.payload || {}
		} catch {
			throw new ValidationException({ authorization: 'Invalid JWT token' })
		}
	}
}
