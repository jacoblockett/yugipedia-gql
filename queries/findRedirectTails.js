import normalizePageName from "../utils/normalizePageName.js"
import isNonNullStringArray from "../utils/isNonNullStringArray.js"
import { titlesQuery } from "../api/query.js"
import dedupeArray from "../utils/dedupeArray.js"
import properCase from "../utils/properCase.js"
import { addError, addErrorAndExit } from "../utils/errorStore.js"

const findRedirectTails = async (pageNames, userAgent) => {
	if (!isNonNullStringArray(pageNames))
		throw new TypeError(`Expected pageNames to be an array of strings`)

	pageNames = pageNames
		.map(pageName => {
			const normalized = normalizePageName(pageName)
			const upperCased = normalized.toUpperCase()
			const properCased = properCase(normalized)
			const lowerCased = normalized.toLowerCase()

			const versions = [...new Set([normalized, upperCased, properCased, lowerCased])]

			return { original: pageName, versions }
		})
		.reduce((acc, pageName) => {
			const regex = new RegExp(`${pageName.original}|${pageName.versions.join("|")}`)
			const match = acc.find(pageName => {
				const query = `${pageName?.original ?? ""}|${(pageName?.versions ?? []).join("|")}`

				return regex.test(query)
			})

			if (!match) return [...acc, pageName]

			return acc
		}, [])

	const data = await titlesQuery(
		pageNames.reduce((acc, pageName) => [...acc, ...pageName.versions], []),
		{ "User-Agent": userAgent },
	)

	const redirects = data.redirects
	const pages = Object.values(data?.pages ?? {})
		.filter(page => page.missing !== "")
		.map(page => page.title)
	const results = pageNames
		.map(pageName => {
			const foundVersions = pageName.versions.reduce((acc, version) => {
				if (pages.includes(version)) {
					if (acc.find(found => found.to === version)) return acc

					return [...acc, { from: version, to: version }]
				}

				const foundRedirect = redirects.find(({ from }) => from === version)

				if (foundRedirect) {
					if (acc.find(found => found.to === foundRedirect.to)) return acc

					return [...acc, foundRedirect]
				}

				return acc
			}, [])

			if (foundVersions.length > 1) {
				// produce error -> ambiguous results, should not continue, produce {code: 404}
				addError({
					code: 404,
					log: {
						message: `Ambiguous data found for the page "${pageName.original}", couldn't parse.`,
						context: foundVersions,
					},
				})

				return
			}

			if (foundVersions.length === 0) {
				// produce error -> no results, should not continue, produce {code: 404}
				addError({
					code: 404,
					log: { message: `No data could be found for the page "${pageName.original}"` },
				})

				return
			}

			return foundVersions[0]
		})
		.filter(truthy => truthy)

	return results
}

export default findRedirectTails
