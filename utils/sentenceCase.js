import properCase from "./properCase.js"

const sentenceCase = str => {
	if (typeof str !== "string") return str

	return str.split(/\s+/).map(properCase).join(" ")
}

export default sentenceCase
