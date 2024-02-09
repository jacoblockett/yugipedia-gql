import formatCardData from "../format/formatCardData.js"
import isNonNullStringArray from "../utils/isNonNullStringArray.js"
import findRedirectTails from "./findRedirectTails.js"
import askargs from "../api/askargs.js"

const getCardsByName = async (names, printouts, { userAgent }) => {
	if (!isNonNullStringArray(names)) throw new TypeError(`Expected names to be an array of strings`)

	names = await findRedirectTails(names, userAgent)

	const data = await askargs(
		{ "User-Agent": userAgent },
		names.map(name => name.redirected),
		printouts,
	)

	return await Promise.all(
		names.map(async ({ original, redirected }, i) => {
			const cardData = data.find(({ fulltext }) => redirected === fulltext)

			if (!cardData)
				return { error: { code: 404, message: `Page for <${original}> was not found.` } }

			return formatCardData({ ...cardData, rpno: { original, redirected } }) // rpno - redirected page name object
		}),
	)
}

export default getCardsByName
