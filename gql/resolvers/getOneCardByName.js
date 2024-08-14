import parseCardFields from "../../parse/parseCardFields.js"
import getCardsByName from "../../queries/getCardsByName.js"
import { addWarning } from "../../utils/warningStore.js"

export default async (name, context, info) => {
	const printouts = parseCardFields(info)
	const data = await getCardsByName([name], printouts, context)

	if (!data.length)
		addWarning({
			code: 300,
			log: {
				message: `[getOneCardByNameResolver] Data missing. There is likely an error log explaining this.`,
			},
		})

	return data[0]
}
