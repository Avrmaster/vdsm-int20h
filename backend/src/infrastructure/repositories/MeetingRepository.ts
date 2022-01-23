import { provide } from 'inversify-binding-decorators'
import { inject } from 'inversify'
import { Database } from 'infrastructure/db'
import { JitsiAccess } from 'domain/jitsi/Jitis.dto'
import { MeetingNotFound } from 'domain/exceptions/meetings/MeetingNotFound'

@provide(MeetingRepository)
export class MeetingRepository {
	@inject(Database)
	private readonly db!: Database

	public async saveAccess(access: JitsiAccess): Promise<JitsiAccess> {
		await this.db.query(
			`
          INSERT INTO meetings_accesses(alias, jwt, room_name, is_creator)
          VALUES ($1, $2, $3, $4)
			`,
			[access.alias, access.jwt, access.roomName, access.isCreator],
		)
		return access
	}

	public async getAccess(alias: string): Promise<JitsiAccess> {
		const [res] = await this.db.query<any>(
			`
          SELECT *
          FROM meetings_accesses
          WHERE alias = $1
			`,
			[alias],
		)

		if (!res) {
			throw new MeetingNotFound(alias)
		}

		return {
			alias: res.alias,
			jwt: res.jwt,
			isCreator: res.is_creator,
			roomName: res.room_name,
		}
	}
}
