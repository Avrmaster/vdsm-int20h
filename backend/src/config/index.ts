const CONFIG = {
	rest: {
		port: parseInt(process.env.REST_PORT || '3000'),
		corsOrigin: process.env.CORS_ORIGIN || '*',
	},
	jitsi: {
		appId: process.env.JITSI_APP_ID || 'vpaas-magic-cookie-daaa2caf7bfc4486b8b79f2cefa67f83',
		kid: process.env.JITSI_KID || 'vpaas-magic-cookie-daaa2caf7bfc4486b8b79f2cefa67f83/21b133',
	},
}
export { CONFIG }
