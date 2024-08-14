import { scrapeSetCardLists } from "../../api/scrape.js"
import parseCardFields from "../../parse/parseCardFields.js"
import parseSetCardListFields from "../../parse/parseSetCardListFields.js"
import getCardsByName from "../../queries/getCardsByName.js"
import addKeyTraceToObject from "../../utils/addKeyTraceToObject.js"
import { addWarning } from "../../utils/warningStore.js"

export default async (setName, context, info) => {
	const languages = parseSetCardListFields(info)
	const originLanguages = languages.map(([language]) => language)
	const allCardsInSet = await scrapeSetCardLists(setName, originLanguages)

	if (!Object.keys(allCardsInSet).length) {
		addWarning({
			code: 300,
			log: {
				message: `[getCardsBySetNameResolver] Data missing. There is likely an error log explaining this.`,
			},
		})

		return {}
	}
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
			chunk => chunk.cardNumber || chunk.englishName || chunk.name
		)
		const cardData = await getCardsByName(cardIdentifiers, printouts, context)
		const appendedCardData = cardChunk.map(
			({ cardNumber, englishName, name, notes, print, rarity, setCategory }) => {
				const lookupCard = cardData.find(
					card => card.page.redirectedFrom === (cardNumber || englishName || name)
				)
				const appendedCard = {
					...lookupCard,
					print: {
						notes,
						type: print,
					},
					rarity,
					setCategory,
					setCode: cardNumber,
				}

				return appendedCard
			}
		)

		addKeyTraceToObject(cards, trace, appendedCardData)
	}

	return cards
}
