import axios from "axios"
import QueryError from "../utils/QueryError.js"
import limiter from "./limiter.js"
import { ENDPOINT } from "../utils/constants.js"
import { get } from "./axios.js"
import chunk from "lodash.chunk"

// https://yugipedia.com/api.php?action=help&modules=query

// Currently only using this to find redirected titles. Askargs auto-redirects, sure,
// but unfortunately validating if a page name has redirected through that api doesn't
// seem to be a thing, and I need to's and from's in order to validate if a user-given
// page exists or not (for error messages)

export const titlesQuery = async (pageTitles, headers) => {
	const titleGroups = chunk(pageTitles, 500)
	const response = { redirects: [], pages: {} }

	for (let i = 0; i < titleGroups.length; i++) {
		const titles = titleGroups[i]
		const { data } = await get(ENDPOINT, {
			headers,
			params: { titles: titles.join("|"), action: "query", format: "json", redirects: 1 },
		})

		if (data.error) QueryError(data.error)

		const { redirects, pages } = data.query

		if (Array.isArray(redirects)) response.redirects = response.redirects.concat(redirects)

		const pagesEntries = Object.entries(pages)

		for (let ii = 0; ii < pagesEntries.length; ii++) {
			const [key, value] = pagesEntries[ii]

			response.pages[key] = value
		}
	}

	return response
}
