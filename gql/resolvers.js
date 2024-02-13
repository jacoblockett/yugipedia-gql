import askargs from "../api/askargs.js"
import { scrapeSetCardLists } from "../api/scrape.js"
import parseCardFields from "../parse/parseCardFields.js"
import parseSetCardListFields from "../parse/parseSetCardListFields.js"
import parseSetFields from "../parse/parseSetFields.js"
import getCardsByName from "../queries/getCardsByName.js"
import getSetsByName from "../queries/getSetsByName.js"

import graphqlFields from "graphql-fields"
import addKeyTraceToObject from "../utils/addKeyTraceToObject.js"

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
	const allCardsInSet = await scrapeSetCardLists(setName)
	const languages = parseSetCardListFields(info)

	const cards = {}

	for (let i = 0; i < languages.length; i++) {
		const [language, { trace, requestedCardData }] = languages[i]
		const cardChunk = allCardsInSet[language]

		if (!cardChunk) {
			addKeyTraceToObject(cards, trace, [])
			continue
		}

		const printouts = parseCardFields(requestedCardData, true)
		const cardNumbers = cardChunk.map(chunk => chunk.cardNumber)
		const cardData = await getCardsByName(cardNumbers, printouts, context)
		const appendedCardData = cardData.reduce((acc, card) => {
			const { cardNumber, notes, print, rarity } = cardChunk.find(
				chunk => chunk.cardNumber === card.page.name.queried,
			)
			const appendedCard = {
				...card,
				packCode: cardNumber,
				printNotes: notes,
				printType: print,
				rarity,
			}

			return [...acc, appendedCard]
		}, [])

		addKeyTraceToObject(cards, trace, appendedCardData)
	}

	return cards
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
