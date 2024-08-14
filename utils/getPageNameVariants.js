import FatalError from "../utils/FatalError.js"
import properCase from "../utils/properCase.js"
import sentenceCase from "../utils/sentenceCase.js"
import titleCase from "../utils/titleCase.js"

export default pageName => {
	if (typeof pageName !== "string") FatalError(`Expected pageName to be a string`, pageName)

	const normalized = pageName.replaceAll("_", " ")
	const upperCased = normalized.toUpperCase()
	const properCased = properCase(normalized)
	const titleCased = titleCase(normalized)
	const lowerCased = normalized.toLowerCase()
	const sentenceCased = sentenceCase(normalized)

	return [
		...new Set([
			pageName,
			normalized,
			upperCased,
			properCased,
			titleCased,
			sentenceCased,
			lowerCased,
		]),
	]
}
