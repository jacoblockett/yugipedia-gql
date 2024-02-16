const properCase = string => {
	if (typeof string !== "string") return string

	return string
		.split(/\s/)
		.map(word => (word.length ? `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}` : ""))
		.join(" ")
}

export default properCase
