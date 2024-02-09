import askargs from "../api/askargs.js"
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

export const getCardsBySetNameResolver = async (setName, context, info) => {
	const allCardsInSet = await askargs(
		context.userAgent,
		[`-Has subobject.Set page::${setName}`],
		["Rarity", "Card number"],
	)
	const cardNumbers = allCardsInSet.map(result => result.printouts["Card number"][0]).sort()

	const printouts = parseCardFields(info)
	const data = await getCardsByName(cardNumbers, printouts, context)
	const appendedData = data.reduce((acc, card) => {
		const twin = allCardsInSet.find(
			scard => scard.printouts["Card number"][0] === card.page.name.queried,
		)
		const rarities = twin.printouts.Rarity.map(({ fulltext }) => fulltext)

		for (let i = 0; i < rarities.length; i++) {
			const rarity = rarities[i]
			const appendedCard = {
				...card,
				rarity,
				packCode: card.page.name.queried,
			}

			acc.push(appendedCard)
		}

		return acc
	}, [])

	return appendedData
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
