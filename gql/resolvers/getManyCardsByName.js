import parseCardFields from "../../parse/parseCardFields.js"
import getCardsByName from "../../queries/getCardsByName.js"
import { addWarning } from "../../utils/warningStore.js"

export default async (names, context, info) => {
	const printouts = parseCardFields(info)
	const data = await getCardsByName(names, printouts, context)

	if (!data.length || names.length !== data.length)
		addWarning({
			code: 300,
			log: {
				message: `[getManyCardsByNameResolver] Data missing. There is likely an error log explaining this.`,
			},
		})

	return data
}
