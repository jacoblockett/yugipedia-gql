import parseSetFields from "../../parse/parseSetFields.js"
import getSetsByName from "../../queries/getSetsByName.js"
import { addWarning } from "../../utils/warningStore.js"

export default async (name, context, info) => {
	const printouts = parseSetFields(info)
	const data = await getSetsByName([name], printouts, context)

	if (!data.length)
		addWarning({
			code: 300,
			log: {
				message: `[getOneSetByNameResolver] Data missing. There is likely an error log explaining this.`,
			},
		})

	return data[0]
}
