import graphqlFields from "graphql-fields"
import properCase from "../utils/properCase.js"

const parseSetCardListFields = info => {
	const fields = Object.entries(graphqlFields(info))
	const languages = {}

	for (let i = 0; i < fields.length; i++) {
		const [field, nested] = fields[i]

		if (field === "chinese") {
			if (nested.simplified)
				languages["Simplified Chinese"] = {
					trace: "chinese.simplified",
					requestedCardData: nested.simplified,
				}
			if (nested.traditional)
				languages["Traditional Chinese"] = {
					trace: "chinese.traditional",
					requestedCardData: nested.traditional,
				}
		}

		if (field === "english") {
			if (nested.asian)
				languages["Asian-English"] = {
					trace: "english.asian",
					requestedCardData: nested.asian,
				}
			if (nested.australian)
				languages["Australian English"] = {
					trace: "english.australian",
					requestedCardData: nested.australian,
				}
			if (nested.european)
				languages["European English"] = {
					trace: "english.european",
					requestedCardData: nested.european,
				}
			if (nested.northAmerican)
				languages["North American English"] = {
					trace: "english.northAmerican",
					requestedCardData: nested.northAmerican,
				}
			if (nested.primary)
				languages["English"] = {
					trace: "english.primary",
					requestedCardData: nested.primary,
				}
		}

		if (field === "french") {
			if (nested.canadian)
				languages["French-Canadian"] = {
					trace: "french.canadian",
					requestedCardData: nested.canadian,
				}
			if (nested.primary)
				languages["French"] = {
					trace: "french.primary",
					requestedCardData: nested.primary,
				}
		}

		if (field === "japanese") {
			if (nested.asian)
				languages["Japanese-Asian"] = {
					trace: "japanese.asian",
					requestedCardData: nested.asian,
				}
			if (nested.primary)
				languages["Japanese"] = {
					trace: "japanese.primary",
					requestedCardData: nested.primary,
				}
		}

		if (
			field === "german" ||
			field === "italian" ||
			field === "portuguese" ||
			field === "spanish" ||
			field === "korean"
		)
			languages[properCase(field)] = {
				trace: field,
				requestedCardData: nested,
			}
	}

	return Object.entries(languages)
}

export default parseSetCardListFields
