import axios from "axios"
import limiter from "./limiter.js"
import { ENDPOINT } from "../utils/constants.js"
import { get } from "./axios.js"
import chunk from "lodash.chunk"
import { addError } from "../utils/errorStore.js"

// https://yugipedia.com/api.php?action=help&modules=query

export const titlesQuery = async (pageTitles, headers) => {
	const titleGroups = chunk(pageTitles, 50)
	const response = { redirects: [], pages: {} }

	for (let i = 0; i < titleGroups.length; i++) {
		const titles = titleGroups[i]
		const { data } = await get(ENDPOINT, {
			headers,
			params: { titles: titles.join("|"), action: "query", format: "json", redirects: 1 },
		})

		if (data.error) {
			addError({
				code: 403,
				log: {
					message: `The query action performed produced an error.`,
					payload: data.error,
				},
			})
			continue
		}

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

export const categoryMembersQuery = async (category, headers, options) => {
	options = {
		allowRedirects: options.allowRedirects !== void 0 ? options.allowRedirects : true,
		maxResults: options.maxResults > 0 ? options.maxResults : Infinity,
		categoryTypes:
			Array.isArray(options.categoryTypes) &&
			options.categoryTypes.every(type => typeof type === "string")
				? options.categoryTypes
				: ["page", "subcat", "file"],
	}
	const pageTitles = new Set()

	let cmcontinue = ""

	while (true) {
		const { data } = await get(ENDPOINT, {
			headers,
			params: {
				action: "query",
				list: "categorymembers",
				cmtitle: `Category:${category}`,
				cmlimit: 500,
				cmcontinue,
				cmtype: options.categoryTypes.join("|"),
				format: "json",
			},
		})

		const members = data?.query?.categorymembers

		// Something went wrong if this break happens
		if (!members?.length) break

		for (let i = 0; i < members.length; i++) {
			const { title } = members[i]

			if (title.startsWith("Category:") && options.allowRedirects) {
				const categoryTitle = title.replace("Category:", "")
				const recursed = await categoryMembersQuery(categoryTitle, headers, {
					allowRedirects: true,
					maxResults: options.maxResults,
					categoryTypes: options.categoryTypes,
					_currentSize: pageTitles.size,
				})

				for (let j = 0; j < recursed.length; j++) {
					const recursedTitle = recursed[j]

					pageTitles.add(recursedTitle)
				}
			} else {
				pageTitles.add(title)
			}
		}

		if (!data.continue) break
		if (pageTitles.size + (options._currentSize ?? 0) >= options.maxResults) break

		cmcontinue = data.continue.cmcontinue
	}

	const pageTitlesArray = [...pageTitles]

	if (pageTitlesArray.length > options.maxResults) pageTitlesArray.length = options.maxResults

	return pageTitlesArray
}
