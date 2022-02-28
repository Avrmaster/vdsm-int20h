import { MigrationInterface, QueryRunner } from 'typeorm'

export class ddosScheme1646042703344 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
        CREATE TABLE ddos_workers
        (
            uuid            TEXT                                NOT NULL
                CONSTRAINT ddos_workers_pk
                    PRIMARY KEY,
            password        TEXT                                NOT NULL,
            readable_name   TEXT                                NOT NULL,
            processes_count INT                                 NOT NULL,
            last_active     TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            is_active       BOOLEAN   DEFAULT TRUE              NOT NULL
        );

        CREATE INDEX ddos_workers_last_active_index
            ON ddos_workers (last_active);

        CREATE TABLE ddos_tasks
        (
            id             SERIAL                                NOT NULL
                CONSTRAINT ddos_tasks_pk
                    PRIMARY KEY,
            worker_uuid    TEXT                                  NOT NULL
                CONSTRAINT ddos_tasks_ddos_workers_uuid_fk
                    REFERENCES ddos_workers
                    ON UPDATE CASCADE ON DELETE CASCADE,
            created_at     timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
            target         TEXT                                  NOT NULL,
            requests_count INT                                   NOT NULL
        );

        CREATE TABLE active_targets
        (
            target TEXT NOT NULL
        );
		`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
        DROP TABLE active_targets;
        DROP TABLE ddos_tasks;
        DROP TABLE ddos_workers;
		`)
	}
}
