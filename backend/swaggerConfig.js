module.exports = {
	swagger: {
		outputDirectory: './src/interfaces/swagger/temp',
		outputFormat: 'OpenApi_3',
		entryFile: './src/**/*.ts',
		yaml: false,
		basePath: '/',
		license: 'MIT',
		securityDefinitions: {},
		ignore: ['**/node_modules/**'],

		version: require('./package.json').version,
		name: '❤️ INT20h TEST ❤️',
	},
}
