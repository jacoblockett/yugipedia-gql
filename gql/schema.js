import {
	GraphQLBoolean,
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
	getManyCardsByNameResolver,
	getManySetsByNameResolver,
	getOneCardByNameResolver,
	getOneSetByNameResolver,
} from "./resolvers.js"

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

const Error = new GraphQLObjectType({
	name: "Error",
	fields: () => ({
		code: { type: GraphQLInt },
		message: { type: GraphQLString },
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
			resolve: async ({ required }, _, context, info) =>
				await getManyCardsByNameResolver(required ?? [], context, info),
		},
		usedFor: {
			type: NonNullInnerList(Card),
			resolve: async ({ usedFor }, _, context, info) =>
				await getManyCardsByNameResolver(usedFor ?? [], context, info),
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
		semanticProperties: { type: NonNullInnerList(GraphQLString) },
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
		error: { type: Error },
		image: { type: CardImage },
		isReal: { type: GraphQLBoolean },
		konamiID: { type: GraphQLString },
		limitation: { type: GraphQLString },
		materials: { type: Materials },
		mediums: { type: NonNullInnerList(GraphQLString) },
		mentions: {
			type: NonNullInnerList(Card),
			resolve: async ({ mentions }, _, context, info) =>
				await getManyCardsByNameResolver(mentions ?? [], context, info),
		},
		miscTags: { type: NonNullInnerList(GraphQLString) },
		name: { type: LocaleText },
		page: { type: WikiPage },
		password: { type: GraphQLString },
		pendulum: { type: Pendulum },
		pro: { type: AntiOrPro },
		related: { type: Related },
		releases: { type: NonNullInnerList(GraphQLString) },
		stats: { type: Stats },
		status: { type: Status },
		summonedBy: {
			type: NonNullInnerList(Card),
			resolve: async ({ summonedBy }, _, context, info) =>
				await getManyCardsByNameResolver(summonedBy ?? [], context, info),
		},
		types: { type: NonNullInnerList(GraphQLString) },
		usedBy: { type: NonNullInnerList(GraphQLString) },
	}),
})

const YGOSet = new GraphQLObjectType({
	name: "Set",
	fields: () => ({
		code: { type: ProductCode },
		coverCards: {
			type: NonNullInnerList(Card),
			resolve: async ({ coverCards }, _, context, info) =>
				await getManyCardsByNameResolver(coverCards ?? [], context, info),
		},
		error: { type: Error },
		format: { type: GraphQLString },
		image: { type: GraphQLString },
		konamiID: { type: SetKonamiDatabaseID },
		mediums: { type: NonNullInnerList(GraphQLString) },
		name: { type: LocaleText },
		page: { type: WikiPage },
		parent: {
			type: YGOSet,
			resolve: async ({ parent }, _, context, info) =>
				parent ? await getOneSetByNameResolver(parent, context, info) : {},
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
		fields: {
			card: {
				type: Card,
				args: { name: { type: new GraphQLNonNull(GraphQLString) } },
				resolve: async (_, { name }, context, info) =>
					await getOneCardByNameResolver(name, context, info),
			},
			set: {
				type: YGOSet,
				args: { name: { type: new GraphQLNonNull(GraphQLString) } },
				resolve: async (_, { name }, context, info) =>
					await getOneSetByNameResolver(name, context, info),
			},
		},
	}),
})

export default schema
