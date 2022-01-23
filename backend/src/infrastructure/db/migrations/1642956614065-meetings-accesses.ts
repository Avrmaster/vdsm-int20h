import { MigrationInterface, QueryRunner } from 'typeorm'

export class meetingsAccesses1642956614065 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE meetings_accesses
            (
                alias      TEXT    NOT NULL
                    CONSTRAINT meetings_accesses_pk
                        PRIMARY KEY,
                jwt        TEXT    NOT NULL,
                room_name  TEXT    NOT NULL,
                is_creator BOOLEAN NOT NULL
            );
        `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            DROP TABLE meetings_accesses
        `)
	}
}
