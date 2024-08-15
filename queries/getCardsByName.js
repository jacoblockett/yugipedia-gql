import formatCardData from "../format/formatCardData.js"
import isStringArray from "../utils/isStringArray.js"
import findRedirects from "./findRedirects.js"
import askargs from "../api/askargs.js"
import FatalError from "../utils/FatalError.js"
import getPageNameVariants from "../utils/getPageNameVariants.js"
import globalValues from "../utils/globalValues.js"
import { findRedirectFromVariants, insertRedirect } from "../utils/cache.js"

const getCardsByName = async (names, printouts) => {
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

	// first, check for any cached redirects

	const cachedRedirects = names.map(findRedirectFromVariants).filter(truthy => truthy)

	if (cachedRedirects.length) {
		console.log("found redirects in cache")
		names = cachedRedirects
	} else {
		console.log("no redirects in cache")
		names = await findRedirects(names)
	}

	if (!names.length) return []

	const data = await askargs(
		{ "User-Agent": globalValues.userAgent },
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

			insertRedirect(from, to)

			return await formatCardData({ ...cardData, rpno: { from, to } }) // rpno - redirected page name object
		})
	)
}

export default getCardsByName
