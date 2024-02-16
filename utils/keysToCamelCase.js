import camelCase from "lodash.camelcase"
import FatalError from "./FatalError.js"

const keysToCamelCase = object => {
	if (Object.prototype.toString.call(object) !== "[object Object]")
		FatalError(`Expected object to be an object`, object)

	return Object.entries(object).reduce((acc, [key, value]) => {
		acc[camelCase(key)] = value

		return acc
	}, {})
}

export default keysToCamelCase
