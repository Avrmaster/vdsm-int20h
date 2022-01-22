module.exports = {
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	username: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD || 'postgres',
	database: process.env.DB_DATABASE || 'takeuseat-core-service',
	port: (process.env.DB_PORT && +process.env.DB_PORT) || 5432,
	migrationsTableName: '__migrations__',
	migrations: ['./src/infrastructure/db/migrations/*.ts'],
	cli: {
		migrationsDir: './src/infrastructure/db/migrations',
	},
}
