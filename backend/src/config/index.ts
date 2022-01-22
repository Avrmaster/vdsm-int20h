const CONFIG = {
	rest: {
		port: parseInt(process.env.REST_PORT || '3000'),
		corsOrigin: process.env.CORS_ORIGIN || '*',
	},
}
export { CONFIG }
