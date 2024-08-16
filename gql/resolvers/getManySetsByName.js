import parseSetFields from "../../parse/parseSetFields.js"
import getSetsByName from "../../queries/getSetsByName.js"
import { addWarning } from "../../utils/warningStore.js"

export default async (names, info) => {
	const printouts = parseSetFields(info)
	const data = await getSetsByName(names, printouts)

	if (!data.length || names.length !== data.length)
		addWarning({
			code: 300,
			log: {
				message: `[getManySetsByNameResolver] Data missing. There is likely an error log explaining this.`,
			},
		})

	return data
}
