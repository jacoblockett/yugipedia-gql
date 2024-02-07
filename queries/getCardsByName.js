import formatCardData from "../format/formatCardData.js"
import isNonNullStringArray from "../utils/isNonNullStringArray.js"
import findRedirectTails from "./findRedirectTails.js"
import askargs from "../api/askargs.js"

const getCardsByName = async (names, printouts, { userAgent }) => {
	if (!isNonNullStringArray(names)) throw new TypeError(`Expected names to be an array of strings`)

	names = await findRedirectTails(names, userAgent)

	const data = await askargs({ "User-Agent": userAgent }, names, printouts)

	return names.map((name, i) => {
		const cardData = data.find(({ fulltext }) => name === fulltext)

		if (!cardData) return { error: { code: 404, message: `Page for <${name}> was not found.` } }

		return formatCardData(cardData)
	})
}

export default getCardsByName
