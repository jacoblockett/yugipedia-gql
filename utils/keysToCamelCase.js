import camelCase from "lodash.camelcase"

const keysToCamelCase = object => {
	if (Object.prototype.toString.call(object) !== "[object Object]")
		throw new TypeError(`Expected object to be an object`)

	return Object.entries(object).reduce((acc, [key, value]) => {
		acc[camelCase(key)] = value

		return acc
	}, {})
}

export default keysToCamelCase
