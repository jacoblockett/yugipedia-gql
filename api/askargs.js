import { ENDPOINT } from "../utils/constants.js"
import { get } from "./axios.js"
import chunk from "lodash.chunk"
import { addError } from "../utils/errorStore.js"

// https://yugipedia.com/api.php?action=help&modules=askargs

// contrary to what the docs say, condition separation is done with either ]][[ (AND), or ]]OR[[ (OR).
// also contrary to the docs, probably because of this separation symbol thing, you can't have
// more than 15 arguments. I've only tested that with ]]OR[[ separation, so maybe ]][[ is different?
// results also seem to be fucked - can only get a maximum of 5000 results before the offset
// starts shitting itself in an infinite loop

const askargs = async (headers, conditions, printouts = []) => {
	const conditionChunks = chunk(conditions, 15)
	const printoutChunks = chunk(printouts, 50)

	let results = []
	for (let i = 0; i < conditionChunks.length; i++) {
		const conditionChunk = conditionChunks[i]
		const accumulator = {}

		//               🔽 this condition is if there are no printouts
		//                  we still want it to run at least once
		for (let ii = 0; ii < (printoutChunks.length || 1); ii++) {
			const printoutChunk = printoutChunks[ii] ?? []
			let runningResults = {}
			let offset = 0

			while (true) {
				const { data } = await get(ENDPOINT, {
					headers,
					params: {
						action: "askargs",
						conditions: conditionChunk.join("]]OR[["),
						printouts: printoutChunk.join("|"),
						parameters: `|offset=${offset}`,
						format: "json",
					},
				})

				if (data.error) {
					addError({
						code: 403,
						log: {
							message: `The askargs action performed produced an error.`,
							payload: data.error,
						},
					})
					continue
				}

				runningResults = { ...runningResults, ...data.query.results }

				if (!data["query-continue-offset"]) break
				if (offset === data["query-continue-offset"]) break

				offset = data["query-continue-offset"]
			}

			const entries = Object.entries(runningResults)

			for (let iii = 0; iii < entries.length; iii++) {
				const [key, value] = entries[iii]
				const full = accumulator[key] || value

				accumulator[key] = {
					...full,
					printouts: {
						...full.printouts,
						...value.printouts,
					},
				}
			}
		}

		results = results.concat(Object.values(accumulator))
	}

	return results
}

export default askargs
