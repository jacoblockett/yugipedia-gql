import askargs from "../api/askargs.js"
import { scrapeSetCardLists } from "../api/scrape.js"
import parseCardFields from "../parse/parseCardFields.js"
import parseSetCardListFields from "../parse/parseSetCardListFields.js"
import parseSetFields from "../parse/parseSetFields.js"
import getCardsByName from "../queries/getCardsByName.js"
import getSetsByName from "../queries/getSetsByName.js"

import graphqlFields from "graphql-fields"
import addKeyTraceToObject from "../utils/addKeyTraceToObject.js"
import { addWarning } from "../utils/warningStore.js"

export const getOneCardByNameResolver = async (name, context, info) => {
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

export const getManyCardsByNameResolver = async (names, context, info) => {
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

export const getCardsBySetNameResolver = async (setName, context, info) => {
	const allCardsInSet = await scrapeSetCardLists(setName)

	if (!Object.keys(allCardsInSet).length) {
		addWarning({
			code: 300,
			log: {
				message: `[getCardsBySetNameResolver] Data missing. There is likely an error log explaining this.`,
			},
		})

		return {}
	}

	const languages = parseSetCardListFields(info)
	const cards = {}

	for (let i = 0; i < languages.length; i++) {
		const [language, { trace, requestedCardData }] = languages[i]
		const cardChunk = allCardsInSet[language]

		if (!cardChunk) {
			addWarning({
				code: 301,
				log: {
					message: `The language "${language}" does not exist within the dataset`,
					payload: allCardsInSet,
				},
			})
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
					card => card.page.redirectedFrom === (cardNumber || englishName || name),
				)
				const appendedCard = {
					...lookupCard,
					print: {
						notes,
						type: print,
					},
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

	if (!data.length)
		addWarning({
			code: 300,
			log: {
				message: `[getOneSetByNameResolver] Data missing. There is likely an error log explaining this.`,
			},
		})

	return data[0]
}

export const getManySetsByNameResolver = async (names, context, info) => {
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
