import parseCardFields from "../../parse/parseCardFields.js"
import getCardsByName from "../../queries/getCardsByName.js"
import { addWarning } from "../../utils/warningStore.js"

export default async (name, info) => {
	const printouts = parseCardFields(info)
	const data = await getCardsByName([name], printouts)

	if (!data.length)
		addWarning({
			code: 300,
			log: {
				message: `[getOneCardByNameResolver] Data missing. There is likely an error log explaining this.`,
			},
		})

	return data[0]
}
