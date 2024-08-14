import formatCardData from "../format/formatCardData.js"
import isStringArray from "../utils/isStringArray.js"
import findRedirects from "./findRedirects.js"
import askargs from "../api/askargs.js"
import FatalError from "../utils/FatalError.js"
import getPageNameVariants from "../utils/getPageNameVariants.js"

const getCardsByName = async (names, printouts, { userAgent }) => {
	if (!isStringArray(names)) FatalError(`Expected names to be an array of strings`, names)

	names = names.map(getPageNameVariants).reduce((acc, variants) => {
		const dupeIndex = acc.findIndex(uniqueLists =>
			uniqueLists.some(uniqueVariant => variants.includes(uniqueVariant))
		)

		if (dupeIndex >= 0) {
			acc[dupeIndex] = [...new Set([...acc[dupeIndex], ...variants])]
		} else {
			acc.push(variants)
		}

		return acc
	}, [])

	// check for cache here?

	names = await findRedirects(names, userAgent)

	if (!names.length) return []

	const data = await askargs(
		{ "User-Agent": userAgent },
		names.map(name => name.to),
		printouts
	)

	return await Promise.all(
		names.map(async ({ from, to }, i) => {
			const cardData = data.find(({ fulltext: pageName }) => pageName === to)

			if (!cardData) {
				addWarning({
					code: 300,
					log: {
						message: `Data missing for "${from}". There is likely an error log explaining this.`,
					},
				})
				return
			}

			return await formatCardData({ ...cardData, rpno: { from, to } }) // rpno - redirected page name object
		})
	)
}

export default getCardsByName
