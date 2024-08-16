import { titlesQuery } from "../api/query.js"
import { addError } from "../utils/errorStore.js"
import FatalError from "../utils/FatalError.js"
import globalValues from "../utils/globalValues.js"
import isStringArray from "../utils/isStringArray.js"

/**
 * Attempts to find the final destination page of any and all given page names.
 *
 * @param {string[][]} pageNames An array of page name variants to search redirects for. It will be assumed that the first name in each list is the original page name provided by the user, and each subsequent name is a calculated variant
 * @returns {{from: string, to: string}[]}
 */
const getRedirects = async pageNames => {
	if (!Array.isArray(pageNames)) FatalError(`Expected pageNames to be an array`, pageNames)
	if (pageNames.some(variants => !isStringArray(variants)))
		FatalError(`Expected pageNames to be an array of strings`, pageNames)

	const flattenedPageNames = pageNames.flat(Infinity)
	const data = await titlesQuery(flattenedPageNames, { "User-Agent": globalValues.userAgent })
	const redirects = data?.redirects
	const pages = Object.values(data?.pages ?? {}).reduce(
		(acc, page) => (page.missing === "" ? acc : [...acc, page.title]),
		[]
	)
	const results = pageNames
		.map(variants => {
			// checks each page in pages for a match against each variation of the page name variants given
			const foundVersions = variants.reduce((acc, version) => {
				// implicit redirects (such as different letter cases), as well as direct page matches
				// will typically be under the pages value
				if (pages.includes(version)) {
					if (acc.find(found => found.to === version)) return acc

					return [...acc, { from: version, to: version }]
				}

				// explicit redirects will be under the redirects value (i.e. BEWD -> Blue-Eyes White Dragon)
				const foundRedirect = redirects.find(({ from }) => from === version)

				if (foundRedirect) {
					if (acc.find(found => found.to === foundRedirect.to)) return acc

					return [...acc, foundRedirect]
				}

				return acc
			}, [])

			// if multiple pages were found, we don't know which one to return
			if (foundVersions.length > 1) {
				addError({
					code: 404,
					log: {
						message: `Ambiguous data found for the page "${variants[0]}", couldn't parse.`,
						payload: foundVersions,
					},
				})

				return
			}

			// if no pages were found, we can't go any further
			if (foundVersions.length === 0) {
				addError({
					code: 404,
					log: { message: `No data could be found for the page "${variants[0]}"` },
				})

				return
			}

			return foundVersions[0]
		})
		.filter(truthy => truthy)

	return results
}

export default getRedirects
