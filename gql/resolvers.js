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

	// This isn't the best way to do this, I'm sure. Think of something else.
	if (data[0].error.code !== 200) throw new Error(data[0].error.message)

	return data[0]
}

export const getManyCardsByNameResolver = async (names, context, info) => {
	// need to figure out how to handle subset of data throwing 404's, etc.
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
		const cardIdentifiers = cardChunk.map(
			chunk => chunk.cardNumber || chunk.englishName || chunk.name,
		)
		const cardData = await getCardsByName(cardIdentifiers, printouts, context)
		const appendedCardData = cardChunk.map(
			({ cardNumber, englishName, name, notes, print, rarity }) => {
				const lookupCard = cardData.find(
					card => card.page.name.queried === (cardNumber || englishName || name),
				)
				const appendedCard = {
					...lookupCard,
					printNotes: notes,
					printType: print,
					rarity,
					setCode: cardNumber,
				}

				return appendedCard
			},
		)

		addKeyTraceToObject(cards, trace, appendedCardData)
	}

	return cards
}

export const getOneSetByNameResolver = async (name, context, info) => {
	const printouts = parseSetFields(info)
	const data = await getSetsByName([name], printouts, context)

	// This isn't the best way to do this, I'm sure. Think of something else.
	if (data[0].error.code !== 200) throw new Error(data[0].error.message)

	return data[0]
}

export const getManySetsByNameResolver = async (name, context, info) => {
	// need to figure out how to handle subset of data throwing 404's, etc.
	const printouts = parseSetFields(info)
	const data = await getSetsByName(name, printouts, context)

	return data
}
