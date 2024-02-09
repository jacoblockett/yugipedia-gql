import formatSetData from "../format/formatSetData.js"
import isNonNullStringArray from "../utils/isNonNullStringArray.js"
import findRedirectTails from "./findRedirectTails.js"
import askargs from "../api/askargs.js"

const getSetsByName = async (names, printouts, { userAgent }) => {
	if (!isNonNullStringArray(names)) throw new TypeError(`Expected names to be an array of strings`)

	names = await findRedirectTails(names, userAgent)

	const data = await askargs(
		{ "User-Agent": userAgent },
		names.map(name => name.redirected),
		printouts,
	)

	return await Promise.all(
		names.map(async ({ original, redirected }, i) => {
			const setData = data.find(({ fulltext }) => redirected === fulltext)

			if (!setData)
				return { error: { code: 404, message: `Page for <${original}> was not found.` } }

			return formatSetData({ ...setData, rpno: { original, redirected } }) // rpno - redirected page name object
		}),
	)
}

export default getSetsByName
