import Joi from "joi"
import FatalError from "./FatalError.js"
import overrideUncaughtExceptionLog from "./overrideUncaughtExceptionLog.js"

const errors = []

const errorObjectSchema = Joi.object({
	code: Joi.number().min(0).max(1000).required(),
	log: Joi.object({
		message: Joi.string().required(),
		payload: Joi.any(),
	}).required(),
})

/**
 * Pushes an error object to the error store
 *
 * @param {{code: number, log: {message: string, payload: any}}} error
 */
export const addError = error => {
	const validation = errorObjectSchema.validate(error)

	if (validation.error) FatalError("error object validation failed", validation.error)

	errors.push(error)
}

/**
 * Pushes an error object to the error store and throws
 *
 * @param {{code: number, log: {message: string, payload: any}}} error
 */
export const addErrorAndExit = error => {
	const validation = errorObjectSchema.validate(error)

	if (validation.error) FatalError("error object validation failed", validation.error)

	errors.push(error)

	overrideUncaughtExceptionLog()

	throw ""
}

export const clearErrors = () => (errors.length = 0)

export default errors
