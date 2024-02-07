const isNonNullStringArray = array => {
	if (!Array.isArray(array)) return false
	if (array.length < 1) return false
	if (array.some(item => typeof item !== "string")) return false

	return true
}

export default isNonNullStringArray
