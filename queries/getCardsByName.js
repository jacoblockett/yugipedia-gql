import formatCardData from "../format/formatCardData.js"
import isNonNullStringArray from "../utils/isNonNullStringArray.js"
import findRedirects from "./findRedirects.js"
import askargs from "../api/askargs.js"
import { addError } from "../utils/errorStore.js"

const getCardsByName = async (names, printouts, { userAgent }) => {
	if (!isNonNullStringArray(names)) throw new TypeError(`Expected names to be an array of strings`)

	names = await findRedirects(names, userAgent)

	if (!names.length) return []

	const data = await askargs(
		{ "User-Agent": userAgent },
		names.map(name => name.to),
		printouts,
	)

	return await Promise.all(
		names.map(async ({ from, to }, i) => {
			const cardData = data.find(({ fulltext }) => to === fulltext)

			if (!cardData) return { error: { code: 404, message: `Page for <${from}> was not found.` } }

			return await formatCardData({ ...cardData, rpno: { from, to } }) // rpno - redirected page name object
		}),
	)
}

export default getCardsByName
