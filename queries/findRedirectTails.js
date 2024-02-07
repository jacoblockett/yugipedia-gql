import normalizePageName from "../utils/normalizePageName.js"
import isNonNullStringArray from "../utils/isNonNullStringArray.js"
import { titlesQuery } from "../api/query.js"
import dedupeArray from "../utils/dedupeArray.js"

const findRedirectTails = async (pageNames, userAgent) => {
	if (!isNonNullStringArray(pageNames))
		throw new TypeError(`Expected pageNames to be an array of strings`)

	const data = await titlesQuery(dedupeArray(pageNames.map(normalizePageName)), {
		"User-Agent": userAgent,
	})

	const redirectsFound = data.redirects

	if (!redirectsFound) return pageNames

	return pageNames.map(name => {
		const redirectTwin = redirectsFound.find(redirect => redirect.from === name)

		return redirectTwin ? redirectTwin.to : name
	})
}

export default findRedirectTails
