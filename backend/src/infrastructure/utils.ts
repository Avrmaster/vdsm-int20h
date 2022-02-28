import _ from 'lodash'

import { AppException } from 'domain/exceptions'

interface Type<T> extends Function {
	new (...args: any[]): T
}

interface CheckAndSortProps<T> {
	requestedIds: any[]
	res: T[]
	idKey: string
	exceptionClass?: Type<AppException>
}

//TODO: rewrite this in actual Typescript :facepalm:
export function checkAndSort<T>({
	requestedIds,
	res,
	idKey,
	exceptionClass: ExceptionClass,
}: CheckAndSortProps<T>): T[] {
	// I just find comments below hilarius :)
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const foundIds = res.map((r) => _.get(r, idKey))
	const notFoundIds = _.differenceWith(requestedIds, foundIds, _.isEqual)
	if (notFoundIds.length && ExceptionClass) {
		throw new ExceptionClass({
			[idKey]: notFoundIds,
		})
	}

	const idMap = createMap({
		array: res,
		idKey,
	})

	return requestedIds.filter((id) => !!idMap[id]).map((id) => idMap[id])
}

interface CreateMapProps<T extends Record<string, any>> {
	array: T[]
	idKey: string
}

export function createMap<T>({ array, idKey }: CreateMapProps<T>): Record<string, T> {
	const idMap: Record<any, T> = {}
	array.forEach((el) => (idMap[_.get(el, idKey)] = el))
	return idMap
}
