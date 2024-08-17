import getRedirects from "../queries/getRedirects.js"
import getPageNameVariants from "./getPageNameVariants.js"
import { insertRedirect, findRedirectFromVariants } from "./cache.js"
import globalValues from "./globalValues.js"

const findAndCacheRedirects = async names => {
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

	if (!globalValues.cache) return await getRedirects(names)

	const cachedRedirects = names.map(findRedirectFromVariants).filter(truthy => truthy)

	if (cachedRedirects.length) return cachedRedirects

	names = await getRedirects(names)

	for (const name of names) insertRedirect(name.from, name.to)

	return names
}

export default findAndCacheRedirects
