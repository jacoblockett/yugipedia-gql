const addKeyTraceToObject = (obj, trace, value) => {
	const keys = trace.split(".")
	let current = obj

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i]

		if (current[key] === void 0) {
			current[key] = {}
		}

		current = current[key]
	}

	const lastKey = keys[keys.length - 1]

	current[lastKey] = value
}

export default addKeyTraceToObject
