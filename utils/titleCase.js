// stolen from https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/46774740#46774740

const titleCase = str => {
	if (typeof str !== "string") return str

	const articles = ["a", "an", "the"]
	const conjunctions = ["for", "and", "nor", "but", "or", "yet", "so"]
	const prepositions = [
		"with",
		"at",
		"from",
		"into",
		"upon",
		"of",
		"to",
		"in",
		"for",
		"on",
		"by",
		"like",
		"over",
		"plus",
		"but",
		"up",
		"down",
		"off",
		"near",
	]

	// The list of spacial characters can be tweaked here
	const replaceCharsWithSpace = str => str.replace(/[^0-9a-z&/\\]/gi, " ").replace(/(\s\s+)/gi, " ")
	const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.substr(1)
	const normalizeStr = str => str.toLowerCase().trim()
	const shouldCapitalize = (word, fullWordList, posWithinStr) => {
		if (posWithinStr == 0 || posWithinStr == fullWordList.length - 1) {
			return true
		}

		return !(articles.includes(word) || conjunctions.includes(word) || prepositions.includes(word))
	}

	str = replaceCharsWithSpace(str)
	str = normalizeStr(str)

	let words = str.split(" ")
	if (words.length <= 2) {
		// Strings less than 3 words long should always have first words capitalized
		words = words.map(w => capitalizeFirstLetter(w))
	} else {
		for (let i = 0; i < words.length; i++) {
			words[i] = shouldCapitalize(words[i], words, i)
				? capitalizeFirstLetter(words[i], words, i)
				: words[i]
		}
	}

	return words.join(" ")
}

export default titleCase
