import Joi from "joi"
import FatalError from "./FatalError.js"

const warnings = []

const warningObjectSchema = Joi.object({
	code: Joi.number().min(0).max(1000).required(),
	log: Joi.object({
		message: Joi.string().required(),
		payload: Joi.any(),
	}).required(),
})

/**
 * Pushes a warning object to the warning store
 *
 * @param {{code: number, log: {message: string, payload: any}}} warning
 */
export const addWarning = warning => {
	const validation = warningObjectSchema.validate(warning)

	if (validation.error) FatalError("warning object validation failed", validation.error)

	warnings.push(warning)
}

export const clearWarnings = () => (warnings.length = 0)

export default warnings
