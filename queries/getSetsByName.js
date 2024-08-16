import formatSetData from "../format/formatSetData.js"
import isStringArray from "../utils/isStringArray.js"
import askargs from "../api/askargs.js"
import FatalError from "../utils/FatalError.js"
import globalValues from "../utils/globalValues.js"
import { findPrintouts, insertPrintout } from "../utils/cache.js"
import findAndCacheRedirects from "../utils/findAndCacheRedirects.js"

const getSetsByName = async (names, printouts) => {
	if (!isStringArray(names)) FatalError(`Expected names to be an array of strings`, names)

	names = await findAndCacheRedirects(names)

	if (!names.length) return []

	// finds all the printouts that exist in the cache
	// even if one printout is missing from the specific page name, its cache will be discarded and re-queried
	// this sounds hella inefficient, but given the way these queries are set up to be batch-style requests,
	// it's the lesser of two evil approaches
	const { cached, unCached } = names.reduce(
		(acc, { to: pageName }) => {
			const cachedPrintoutObjects = findPrintouts(pageName)
			const cachedPrintoutNames = cachedPrintoutObjects.map(x => x.printout)

			if (printouts.every(printout => cachedPrintoutNames.includes(printout))) {
				acc.cached.push({
					fulltext: pageName,
					printouts: cachedPrintoutObjects.reduce((acc, { printout, payload }) => {
						acc[printout] = payload

						return acc
					}, {}),
					fromCache: true,
				})
			} else {
				acc.unCached.push(pageName)
			}

			return acc
		},
		{ cached: [], unCached: [] }
	)

	const data = (
		unCached.length
			? await askargs({ "User-Agent": globalValues.userAgent }, unCached, printouts)
			: []
	).concat(cached)

	return await Promise.all(
		names.map(async ({ from, to }, i) => {
			const setData = data.find(({ fulltext: pageName }) => pageName === to)

			if (!setData) {
				addWarning({
					code: 300,
					log: {
						message: `Data missing for "${from}". There is likely an error log explaining this.`,
					},
				})
				return
			}

			// add any freshly queried data to the cache before formatting
			if (!setData.fromCache) {
				for (const printout of Object.entries(setData.printouts)) {
					insertPrintout(to, printout[0], printout[1])
				}
			}

			return await formatSetData({ ...setData, rpno: { from, to } }) // rpno - redirected page name object
		})
	)
}

export default getSetsByName
