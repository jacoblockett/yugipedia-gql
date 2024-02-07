import parseCardFields from "../parse/parseCardFields.js"
import parseSetFields from "../parse/parseSetFields.js"
import getCardsByName from "../queries/getCardsByName.js"
import getSetsByName from "../queries/getSetsByName.js"

export const getOneCardByNameResolver = async (name, context, info) => {
	const printouts = parseCardFields(info)
	const data = await getCardsByName([name], printouts, context)

	return data[0]
}

export const getManyCardsByNameResolver = async (names, context, info) => {
	const printouts = parseCardFields(info)
	const data = await getCardsByName(names, printouts, context)

	return data
}

export const getOneSetByNameResolver = async (name, context, info) => {
	const printouts = parseSetFields(info)
	const data = await getSetsByName([name], printouts, context)

	return data[0]
}

export const getManySetsByNameResolver = async (name, context, info) => {
	const printouts = parseSetFields(info)
	const data = await getSetsByName(name, printouts, context)

	return data
}
