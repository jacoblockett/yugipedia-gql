const properCase = string => {
	if (typeof string !== "string") throw new TypeError(`Expected string to be a string`)

	return string
		.split(/\s/)
		.map(word => (word.length ? `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}` : ""))
		.join(/\s/)
}

export default properCase
