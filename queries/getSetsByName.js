import formatSetData from "../format/formatSetData.js"
import isNonNullStringArray from "../utils/isNonNullStringArray.js"
import findRedirectTails from "./findRedirectTails.js"
import askargs from "../api/askargs.js"

const getSetsByName = async (names, printouts, { userAgent }) => {
	if (!isNonNullStringArray(names)) throw new TypeError(`Expected names to be an array of strings`)

	names = await findRedirectTails(names, userAgent)

	const data = await askargs({ "User-Agent": userAgent }, names, printouts)

	return names.map((name, i) => {
		const setData = data.find(({ fulltext }) => name === fulltext)

		if (!setData) return { error: { code: 404, message: `Page for <${name}> was not found.` } }

		return formatSetData(setData)
	})
}

export default getSetsByName
