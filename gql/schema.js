import {
	GraphQLBoolean,
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	buildSchema,
} from "graphql"
import parseRequestedFields from "../parse/parseCardFields.js"
import getCardsByName from "../queries/getCardsByName.js"
import {
	getCardsBySetNameResolver,
	getManyCardsByNameResolver,
	getManySetsByNameResolver,
	getOneCardByNameResolver,
	getOneSetByNameResolver,
} from "./resolvers.js"
import { categoryMembersQuery } from "../api/query.js"
import { addError, addErrorAndExit } from "../utils/errorStore.js"

const NonNullInnerList = scalarType => new GraphQLList(new GraphQLNonNull(scalarType))

const Actions = new GraphQLObjectType({
	name: "Actions",
	fields: () => ({
		all: { type: NonNullInnerList(GraphQLString) },
		attack: { type: NonNullInnerList(GraphQLString) },
		banish: { type: NonNullInnerList(GraphQLString) },
		card: { type: NonNullInnerList(GraphQLString) },
		counter: { type: NonNullInnerList(GraphQLString) },
		lifepoint: { type: NonNullInnerList(GraphQLString) },
		stat: { type: NonNullInnerList(GraphQLString) },
		summoning: { type: NonNullInnerList(GraphQLString) },
	}),
})

const AntiOrPro = new GraphQLObjectType({
	name: "AntiOrPro",
	fields: () => ({
		all: { type: NonNullInnerList(GraphQLString) },
		support: { type: NonNullInnerList(GraphQLString) },
		archetype: { type: NonNullInnerList(GraphQLString) },
	}),
})

const CardImage = new GraphQLObjectType({
	name: "CardImage",
	fields: () => ({
		artwork: { type: GraphQLString },
		back: { type: GraphQLString },
		front: { type: GraphQLString },
		name: { type: GraphQLString },
	}),
})

const CardList = new GraphQLObjectType({
	name: "CardList",
	fields: () => ({
		chinese: { type: CardListChinese },
		english: { type: CardListEnglish },
		french: { type: CardListFrench },
		german: { type: new GraphQLList(Card) },
		italian: { type: new GraphQLList(Card) },
		portuguese: { type: new GraphQLList(Card) },
		spanish: { type: new GraphQLList(Card) },
		korean: { type: new GraphQLList(Card) },
		japanese: { type: CardListJapanese },
	}),
})

const CardListChinese = new GraphQLObjectType({
	name: "CardListChinese",
	fields: () => ({
		simplified: { type: new GraphQLList(Card) },
		traditional: { type: new GraphQLList(Card) },
	}),
})

const CardListEnglish = new GraphQLObjectType({
	name: "CardListEnglish",
	fields: () => ({
		asian: { type: new GraphQLList(Card) },
		australian: { type: new GraphQLList(Card) },
		european: { type: new GraphQLList(Card) },
		northAmerican: { type: new GraphQLList(Card) },
		primary: { type: new GraphQLList(Card) },
	}),
})

const CardListFrench = new GraphQLObjectType({
	name: "CardListFrench",
	fields: () => ({
		canadian: { type: new GraphQLList(Card) },
		primary: { type: new GraphQLList(Card) },
	}),
})

const CardListJapanese = new GraphQLObjectType({
	name: "CardListJapanese",
	fields: () => ({
		asian: { type: new GraphQLList(Card) },
		primary: { type: new GraphQLList(Card) },
	}),
})

const ChineseTextObject = new GraphQLObjectType({
	name: "ChineseTextObject",
	fields: () => ({
		primary: { type: DetailedChineseTextObject },
		simplified: { type: DetailedChineseTextObject },
		traditional: { type: DetailedChineseTextObject },
	}),
})

const ChineseStringObject = new GraphQLObjectType({
	name: "ChineseStringObject",
	fields: () => ({
		simplified: { type: GraphQLString },
		traditional: { type: GraphQLString },
	}),
})

const DebutDate = new GraphQLObjectType({
	name: "DebutDate",
	fields: () => ({
		main: { type: GraphQLString },
		ocg: { type: GraphQLString },
		tcg: { type: GraphQLString },
		tcgSpeedDuel: { type: GraphQLString },
	}),
})

const DetailedChineseTextObject = new GraphQLObjectType({
	name: "DetailedChineseTextObject",
	fields: () => ({
		hanzi: { type: GraphQLString },
		jyutping: { type: GraphQLString },
		pinyin: { type: GraphQLString },
		translated: { type: GraphQLString },
	}),
})

const FrenchLocalDetailObject = new GraphQLObjectType({
	name: "FrenchLocalDetailObject",
	fields: () => ({
		canadian: { type: GraphQLString },
		primary: { type: GraphQLString },
	}),
})

const JapaneseLocalDetailObject = new GraphQLObjectType({
	name: "JapaneseLocalDetailObject",
	fields: () => ({
		asian: { type: GraphQLString },
		primary: { type: GraphQLString },
	}),
})

const JapaneseTextObject = new GraphQLObjectType({
	name: "JapaneseTextObject",
	fields: () => ({
		html: { type: GraphQLString },
		base: { type: GraphQLString },
		annotation: { type: GraphQLString },
		transposed: { type: GraphQLString },
		adjacent: { type: GraphQLString },
		romaji: { type: JapaneseTextObjectInner },
		translated: { type: JapaneseTextObjectInner },
	}),
})

const JapaneseTextObjectInner = new GraphQLObjectType({
	name: "JapaneseTextObjectInner",
	fields: () => ({
		base: { type: GraphQLString },
		annotation: { type: GraphQLString },
	}),
})

const KoreanTextObject = new GraphQLObjectType({
	name: "KoreanTextObject",
	fields: () => ({
		html: { type: GraphQLString },
		base: { type: GraphQLString },
		annotation: { type: GraphQLString },
		transposed: { type: GraphQLString },
		adjacent: { type: GraphQLString },
		romanized: { type: GraphQLString },
		translated: { type: GraphQLString },
	}),
})

const Link = new GraphQLObjectType({
	name: "Link",
	fields: () => ({
		arrows: { type: NonNullInnerList(GraphQLString) },
		rating: { type: GraphQLString },
	}),
})

const LocaleText = new GraphQLObjectType({
	name: "LocaleText",
	fields: () => ({
		arabic: { type: GraphQLString },
		chinese: { type: ChineseTextObject },
		croatian: { type: GraphQLString },
		english: { type: GraphQLString },
		french: { type: GraphQLString },
		german: { type: GraphQLString },
		greek: { type: GraphQLString },
		italian: { type: GraphQLString },
		japanese: { type: JapaneseTextObject },
		korean: { type: KoreanTextObject },
		portuguese: { type: GraphQLString },
		spanish: { type: GraphQLString },
	}),
})

const Materials = new GraphQLObjectType({
	name: "Materials",
	fields: () => ({
		required: {
			type: NonNullInnerList(Card),
			resolve: async ({ required }, _, context, info) => {
				try {
					return await getManyCardsByNameResolver(required ?? [], context, info)
				} catch (error) {
					if (!error.isKnownError) {
						addError({
							code: 501,
							log: { message: `An unknown error occurred.`, payload: error },
						})
					}

					return []
				}
			},
		},
		usedFor: {
			type: NonNullInnerList(Card),
			resolve: async ({ usedFor }, _, context, info) => {
				try {
					return await getManyCardsByNameResolver(usedFor ?? [], context, info)
				} catch (error) {
					if (!error.isKnownError) {
						addError({
							code: 501,
							log: { message: `An unknown error occurred.`, payload: error },
						})
					}

					return []
				}
			},
		},
	}),
})

const Pendulum = new GraphQLObjectType({
	name: "Pendulum",
	fields: () => ({
		effect: { type: LocaleText },
		scale: { type: GraphQLString },
	}),
})

const Related = new GraphQLObjectType({
	name: "Related",
	fields: () => ({
		all: { type: NonNullInnerList(GraphQLString) },
		direct: { type: NonNullInnerList(GraphQLString) },
		indirect: { type: NonNullInnerList(GraphQLString) },
	}),
})

const Prefix = new GraphQLObjectType({
	name: "Prefix",
	fields: () => ({
		chinese: { type: ChineseStringObject },
		english: { type: PrefixEnglish },
		french: { type: FrenchLocalDetailObject },
		german: { type: GraphQLString },
		italian: { type: GraphQLString },
		japanese: { type: JapaneseLocalDetailObject },
		korean: { type: GraphQLString },
		spanish: { type: GraphQLString },
		portuguese: { type: GraphQLString },
	}),
})

const PrefixEnglish = new GraphQLObjectType({
	name: "PrefixEnglish",
	fields: () => ({
		asian: { type: GraphQLString },
		earliest: { type: GraphQLString },
		european: { type: GraphQLString },
		oceanic: { type: GraphQLString },
	}),
})

const PrintDetails = new GraphQLObjectType({
	name: "PrintDetails",
	fields: () => ({
		notes: { type: GraphQLString },
		type: { type: GraphQLString },
	}),
})

const ProductCode = new GraphQLObjectType({
	name: "ProductCode",
	fields: () => ({
		ean: { type: GraphQLString },
		isbn: { type: GraphQLString },
		upc: { type: GraphQLString },
	}),
})

const SetKonamiDatabaseID = new GraphQLObjectType({
	name: "SetKonamiDatabaseID",
	fields: () => ({
		chinese: { type: ChineseStringObject },
		english: { type: SetKonamiDatabaseIDEnglish },
		french: { type: GraphQLString },
		german: { type: GraphQLString },
		italian: { type: GraphQLString },
		japanese: { type: GraphQLString },
		korean: { type: GraphQLString },
		spanish: { type: GraphQLString },
		portuguese: { type: GraphQLString },
	}),
})

const SetKonamiDatabaseIDEnglish = new GraphQLObjectType({
	name: "SetKonamiDatabaseIDEnglish",
	fields: () => ({
		asian: { type: GraphQLString },
		earliest: { type: GraphQLString },
	}),
})

const SetReleaseDate = new GraphQLObjectType({
	name: "SetReleaseDate",
	fields: () => ({
		chinese: { type: ChineseStringObject },
		english: { type: SetReleaseDateEnglish },
		french: { type: FrenchLocalDetailObject },
		german: { type: GraphQLString },
		italian: { type: GraphQLString },
		japanese: { type: JapaneseLocalDetailObject },
		korean: { type: GraphQLString },
		spanish: { type: SetReleaseDateSpanish },
		portuguese: { type: GraphQLString },
	}),
})

const SetReleaseDateEnglish = new GraphQLObjectType({
	name: "SetReleaseDateEnglish",
	fields: () => ({
		asian: { type: GraphQLString },
		earliest: { type: GraphQLString },
		en: { type: GraphQLString },
		european: { type: GraphQLString },
		northAmerican: { type: GraphQLString },
		oceanic: { type: GraphQLString },
		worldwide: { type: GraphQLString },
	}),
})

const SetReleaseDateSpanish = new GraphQLObjectType({
	name: "SetReleaseDateSpanish",
	fields: () => ({
		european: { type: GraphQLString },
		latinAmerican: { type: GraphQLString },
		primary: { type: GraphQLString },
	}),
})

const Stats = new GraphQLObjectType({
	name: "Stats",
	fields: () => ({
		attack: { type: GraphQLString },
		attribute: { type: GraphQLString },
		defense: { type: GraphQLString },
		level: { type: GraphQLString },
		rank: { type: GraphQLString },
		stars: { type: GraphQLString },
		link: { type: Link },
	}),
})

const Status = new GraphQLObjectType({
	name: "Status",
	fields: () => ({
		ocg: { type: GraphQLString },
		rushDuel: { type: GraphQLString },
		tcg: { type: GraphQLString },
		tcgSpeedDuel: { type: GraphQLString },
		tcgTraditionalFormat: { type: GraphQLString },
	}),
})

const WikiPage = new GraphQLObjectType({
	name: "WikiPage",
	fields: () => ({
		lastModified: { type: GraphQLString },
		name: { type: GraphQLString },
		redirectedFrom: { type: GraphQLString },
		semanticProperties: { type: NonNullInnerList(GraphQLString) }, // need to implement
		type: { type: GraphQLString },
		url: { type: GraphQLString },
	}),
})

const Card = new GraphQLObjectType({
	name: "Card",
	fields: () => ({
		actions: { type: Actions },
		anti: { type: AntiOrPro },
		appearsIn: { type: NonNullInnerList(GraphQLString) },
		cardType: { type: GraphQLString },
		charactersDepicted: { type: NonNullInnerList(GraphQLString) },
		debutDate: { type: DebutDate },
		deckType: { type: GraphQLString },
		description: { type: LocaleText },
		effectTypes: { type: NonNullInnerList(GraphQLString) },
		image: { type: CardImage },
		isReal: { type: GraphQLBoolean },
		konamiID: { type: GraphQLString },
		limitation: { type: GraphQLString },
		materials: { type: Materials },
		mediums: { type: NonNullInnerList(GraphQLString) },
		mentions: {
			type: NonNullInnerList(Card),
			resolve: async ({ mentions }, _, context, info) => {
				try {
					return await getManyCardsByNameResolver(mentions ?? [], context, info)
				} catch (error) {
					if (!error.isKnownError) {
						addError({
							code: 501,
							log: { message: `An unknown error occurred.`, payload: error },
						})
					}

					return []
				}
			},
		},
		miscTags: { type: NonNullInnerList(GraphQLString) },
		name: { type: LocaleText },
		page: { type: WikiPage },
		password: { type: GraphQLString },
		pendulum: { type: Pendulum },
		print: { type: PrintDetails },
		pro: { type: AntiOrPro },
		rarity: { type: GraphQLString },
		related: { type: Related },
		releases: { type: NonNullInnerList(GraphQLString) },
		setCode: { type: GraphQLString },
		stats: { type: Stats },
		status: { type: Status },
		summonedBy: {
			type: NonNullInnerList(Card),
			resolve: async ({ summonedBy }, _, context, info) => {
				try {
					return await getManyCardsByNameResolver(summonedBy ?? [], context, info)
				} catch (error) {
					if (!error.isKnownError) {
						addError({
							code: 501,
							log: { message: `An unknown error occurred.`, payload: error },
						})
					}

					return []
				}
			},
		},
		types: { type: NonNullInnerList(GraphQLString) },
		usedBy: { type: NonNullInnerList(GraphQLString) },
	}),
})

const Set = new GraphQLObjectType({
	name: "Set",
	fields: () => ({
		cards: {
			type: CardList,
			resolve: async ({ page }, _, context, info) => {
				try {
					return await getCardsBySetNameResolver(page?.name, context, info)
				} catch (error) {
					if (!error.isKnownError) {
						addError({
							code: 501,
							log: { message: `An unknown error occurred.`, payload: error },
						})
					}

					return {}
				}
			},
		},
		code: { type: ProductCode },
		coverCards: {
			type: NonNullInnerList(Card),
			resolve: async ({ coverCards }, _, context, info) => {
				try {
					return await getManyCardsByNameResolver(coverCards ?? [], context, info)
				} catch (error) {
					if (!error.isKnownError) {
						addError({
							code: 501,
							log: { message: `An unknown error occurred.`, payload: error },
						})
					}

					return []
				}
			},
		},
		format: { type: GraphQLString },
		image: { type: GraphQLString },
		konamiID: { type: SetKonamiDatabaseID },
		mediums: { type: NonNullInnerList(GraphQLString) },
		name: { type: LocaleText },
		page: { type: WikiPage },
		parent: {
			type: Set,
			resolve: async ({ parent }, _, context, info) => {
				if (parent) {
					try {
						return await getOneSetByNameResolver(parent, context, info)
					} catch (error) {
						if (!error.isKnownError) {
							addError({
								code: 501,
								log: { message: `An unknown error occurred.`, payload: error },
							})
						}

						return []
					}
				} else {
					return {}
				}
			},
		},
		prefix: { type: Prefix },
		promotionalSeries: { type: GraphQLString },
		regionalPrefix: { type: Prefix },
		releaseDate: { type: SetReleaseDate },
		type: { type: GraphQLString },
	}),
})

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "RootQuery",
		fields: () => ({
			card: {
				type: Card,
				args: { searchTerm: { type: new GraphQLNonNull(GraphQLString) } },
				resolve: async (_, { searchTerm }, context, info) => {
					try {
						return await getOneCardByNameResolver(searchTerm, context, info)
					} catch (error) {
						if (!error.isKnownError) {
							addError({
								code: 501,
								log: { message: `An unknown error occurred.`, payload: error },
							})
						}

						return {}
					}
				},
			},
			set: {
				type: Set,
				args: { searchTerm: { type: new GraphQLNonNull(GraphQLString) } },
				resolve: async (_, { searchTerm }, context, info) => {
					try {
						return await getOneSetByNameResolver(searchTerm, context, info)
					} catch (error) {
						if (!error.isKnownError) {
							addError({
								code: 501,
								log: { message: `An unknown error occurred.`, payload: error },
							})
						}

						return {}
					}
				},
			},
		}),
	}),
})

export default schema
