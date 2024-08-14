import parseSetFields from "../../parse/parseSetFields.js"
import getSetsByName from "../../queries/getSetsByName.js"
import { addWarning } from "../../utils/warningStore.js"

export default async (names, context, info) => {
	const printouts = parseSetFields(info)
	const data = await getSetsByName(names, printouts, context)

	if (!data.length || names.length !== data.length)
		addWarning({
			code: 300,
			log: {
				message: `[getManySetsByNameResolver] Data missing. There is likely an error log explaining this.`,
			},
		})

	return data
}
