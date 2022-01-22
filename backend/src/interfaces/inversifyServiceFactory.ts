import { ServiceFactory } from 'typescript-rest/src/server/model/server-types'

import { container } from 'inversify.config'

/* This class was mostly taken from the internet.
 * God knows what `getTargetClass` method does,
 * but the `create` method helps instantiate controllers instances
 * with inversify container (thus taking care of dependency injection)
 * whenever this is possible.
 * */

export class InversifyServiceFactory implements ServiceFactory {
	public create(serviceClass: any /*, serviceContext: ServiceContext*/) {
		try {
			return container.get(serviceClass)
		} catch (e) {
			console.error(e)
			return new serviceClass()
		}
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	getTargetClass(serviceClass: Function): FunctionConstructor {
		let typeConstructor: any = serviceClass
		if (typeConstructor.name && typeConstructor.name !== 'ioc_wrapper') {
			return typeConstructor as FunctionConstructor
		}
		typeConstructor = typeConstructor.__parent
		while (typeConstructor) {
			if (typeConstructor.name && typeConstructor.name !== 'ioc_wrapper') {
				console.log('>>> RETURN 2')
				return typeConstructor as FunctionConstructor
			}
			typeConstructor = typeConstructor.__parent
		}
		console.log('Can not identify the base Type for requested target: %o', serviceClass)
		throw new TypeError('Can not identify the base Type for requested target')
	}
}
