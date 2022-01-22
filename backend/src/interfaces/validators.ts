import { validateOrReject, ValidatorOptions } from 'class-validator'
import { plainToClass, ClassConstructor } from 'class-transformer'
import { PreProcessor } from 'typescript-rest'
import * as express from 'express'

import { ValidationException } from 'domain/exceptions'

function validateGeneric<T extends object>(
	ValidatableClass: ClassConstructor<T>,
	getRequestPart: (req: express.Request) => any,
	validationOptions?: ValidatorOptions,
) {
	return PreProcessor((request: express.Request) => {
		const requestPart = getRequestPart(request)

		const transformed = plainToClass(ValidatableClass, requestPart)
		return validateOrReject(transformed, validationOptions)
			.then(() => Object.assign(requestPart, transformed))
			.catch((errors) => Promise.reject(new ValidationException(errors)))
	})
}

export function ValidateBody<T extends object>(
	ValidatableClass: ClassConstructor<T>,
	validationOptions?: ValidatorOptions,
) {
	return validateGeneric(ValidatableClass, (r) => r.body, validationOptions)
}

export function ValidatePath<T extends object>(
	ValidatableClass: ClassConstructor<T>,
	validationOptions?: ValidatorOptions,
) {
	return validateGeneric(ValidatableClass, (r) => r.params, validationOptions)
}

export function ValidateQuery<T extends object>(
	ValidatableClass: ClassConstructor<T>,
	validationOptions?: ValidatorOptions,
) {
	return validateGeneric(ValidatableClass, (r) => r.query, validationOptions)
}
