import camelCase from "lodash.camelcase"
import keysToCamelCase from "../utils/keysToCamelCase.js"
import properCase from "../utils/toProperCase.js"
import ruby from "../utils/ruby.js"
import cleanLinkedText from "../utils/cleanLinkedText.js"
import { MEDIA_ENDPOINT } from "../utils/constants.js"
import unixToISO from "../utils/unixToISO.js"

const formatSetData = async data => {
	// console.dir(data, { depth: null }) // for debugging
	const po = keysToCamelCase(data.printouts) // po, for PrintOuts

	const pageDetails = {
		name: po.pageName[0],
		type: po.pageType?.[0] && po.pageType[0].replace(/\s+page$/i, ""),
		url: data.fullurl ?? "",
		lastModified: po.modificationDate?.[0]?.timestamp
			? unixToISO(po.modificationDate[0].timestamp)
			: null,
	}

	if (!/set/i.test(po.pageType?.[0]))
		return {
			error: { code: 400, message: `Page <${data.fullurl}> is not a Set page` },
			page: pageDetails,
		}

	return {
		error: { code: 200, message: "OK" },
		code: {
			ean: po.ean?.[0],
			isbn: po.isbn?.[0],
			upc: po.upc?.[0],
		},
		coverCards: po.coverCard?.[0] ? po.coverCard.map(s => s.fulltext) : null,
		format: po.format?.[0]?.fulltext,
		image: po.setImage?.[0] ? `${MEDIA_ENDPOINT}/${po.setImage[0]}` : null,
		konamiID: {
			chinese: {
				simplified: po.simplifiedChineseDatabaseId?.[0],
			},
			english: {
				asian: po.asianEnglishDatabaseId?.[0]?.fulltext,
				earliest: po.englishDatabaseId?.[0],
			},
			french: po.frenchDatabaseId?.[0],
			german: po.germanDatabaseId?.[0],
			italian: po.italianDatabaseId?.[0],
			japanese: po.japaneseDatabaseId?.[0],
			korean: po.koreanDatabaseId?.[0],
			spanish: po.spanishDatabaseId?.[0],
			portuguese: po.portugueseDatabaseId?.[0],
		},
		mediums: po.medium?.[0] ? po.medium : null,
		name: {
			arabic: null,
			chinese: {
				primary: {
					hanzi: po.chineseName?.[0],
					jyutping: po.chineseJyutpingName?.[0]?.fulltext,
					pinyin: po.chinesePinyinName?.[0]?.fulltext,
					translated: po.translatedChineseName?.[0],
				},
				simplified: {
					hanzi: po.simplifiedChineseName?.[0],
					pinyin: null,
					translated: null,
				},
				traditional: {
					hanzi: po.traditionalChineseName?.[0],
					pinyin: null,
					translated: null,
				},
			},
			croatian: null,
			english: po.englishName?.[0],
			french: po.frenchName?.[0],
			german: po.germanName?.[0],
			greek: null,
			italian: po.italianName?.[0],
			japanese: {
				...(po.japaneseName?.[0] ? await ruby(po.japaneseName[0]) : {}),
				romaji: {
					base: null,
					annotation: po.romajiName?.[0],
				},
				translated: {
					base: null,
					annotation: po.translatedJapaneseName?.[0],
				},
			},
			korean: {
				...(po.koreanName?.[0] ? await ruby(po.koreanName[0]) : {}),
				romanized: po.koreanRevisedRomanizationName?.[0],
				translated: po.translatedKoreanName?.[0],
			},
			portuguese: po.portugueseName?.[0],
			spanish: po.spanishName?.[0],
		},
		page: pageDetails,
		parent: po.parentSet?.[0]?.fulltext,
		prefix: {
			chinese: {
				simplified: po.simplifiedChineseSetPrefix?.[0],
				traditional: po.traditionalChineseSetPrefix?.[0]?.fulltext,
			},
			english: {
				asian: po.asianEnglishSetPrefix?.[0],
				earliest: po.englishSetPrefix?.[0],
				european: po.europeanEnglishSetPrefix?.[0],
				oceanic: po.oceanicEnglishSetPrefix?.[0],
			},
			french: {
				canadian: po.frenchCanadianSetPrefix?.[0],
				local: po.frenchSetPrefix?.[0],
			},
			german: po.germanSetPrefix?.[0],
			italian: po.italianSetPrefix?.[0],
			japanese: {
				asian: po.japaneseAsianSetPrefix?.[0],
				local: po.japaneseSetPrefix?.[0],
			},
			korean: po.koreanSetPrefix?.[0],
			spanish: po.spanishSetPrefix?.[0],
			portuguese: po.portugueseSetPrefix?.[0],
		},
		promotionalSeries: po.series?.[0]?.fulltext,
		regionalPrefix: {
			chinese: {
				simplified: po.simplifiedChineseSetAndRegionPrefix?.[0],
				traditional: po.traditionalChineseSetAndRegionPrefix?.[0]?.fulltext,
			},
			english: {
				asian: po.asianEnglishSetAndRegionPrefix?.[0],
				earliest: po.englishSetAndRegionPrefix?.[0],
				european: po.europeanEnglishSetAndRegionPrefix?.[0],
				oceanic: po.oceanicEnglishSetAndRegionPrefix?.[0],
			},
			french: {
				canadian: po.frenchCanadianSetAndRegionPrefix?.[0],
				local: po.frenchSetAndRegionPrefix?.[0],
			},
			german: po.germanSetAndRegionPrefix?.[0],
			italian: po.italianSetAndRegionPrefix?.[0],
			japanese: {
				asian: po.japaneseAsianSetAndRegionPrefix?.[0],
				local: po.japaneseSetAndRegionPrefix?.[0],
			},
			korean: po.koreanSetAndRegionPrefix?.[0],
			spanish: po.spanishSetAndRegionPrefix?.[0],
			portuguese: po.portugueseSetAndRegionPrefix?.[0],
		},
		releaseDate: {
			chinese: {
				simplified: po.simplifiedChineseReleaseDate?.[0]
					? unixToISO(po.simplifiedChineseReleaseDate[0].timestamp)
					: null,
				traditional: po.traditionalChineseReleaseDate?.[0]
					? unixToISO(po.traditionalChineseReleaseDate[0].timestamp)
					: null,
			},
			english: {
				asian: po.asianEnglishReleaseDate?.[0]
					? unixToISO(po.asianEnglishReleaseDate[0].timestamp)
					: null,
				earliest: po.englishReleaseDate?.[0] ? unixToISO(po.englishReleaseDate[0].timestamp) : null,
				en: po.englishEnReleaseDate?.[0] ? unixToISO(po.englishEnReleaseDate[0].timestamp) : null,
				european: po.europeanEnglishReleaseDate?.[0]
					? unixToISO(po.europeanEnglishReleaseDate[0].timestamp)
					: null,
				northAmerican: po.englishNaReleaseDate?.[0]
					? unixToISO(po.englishNaReleaseDate[0].timestamp)
					: null,
				oceanic: po.oceanicEnglishReleaseDate?.[0]
					? unixToISO(po.oceanicEnglishReleaseDate[0].timestamp)
					: null,
				worldwide: po.worldwideEnglishReleaseDate?.[0]
					? unixToISO(po.worldwideEnglishReleaseDate[0].timestamp)
					: null,
			},
			french: {
				canadian: po.frenchCanadianReleaseDate?.[0]
					? unixToISO(po.frenchCanadianReleaseDate[0].timestamp)
					: null,
				primary: po.frenchReleaseDate?.[0] ? unixToISO(po.frenchReleaseDate[0].timestamp) : null,
			},
			german: po.germanReleaseDate?.[0] ? unixToISO(po.germanReleaseDate[0].timestamp) : null,
			italian: po.italianReleaseDate?.[0] ? unixToISO(po.italianReleaseDate[0].timestamp) : null,
			japanese: {
				asian: po.japaneseAsianReleaseDate?.[0]
					? unixToISO(po.japaneseAsianReleaseDate[0].timestamp)
					: null,
				primary: po.japaneseReleaseDate?.[0]
					? unixToISO(po.japaneseReleaseDate[0].timestamp)
					: null,
			},
			korean: po.koreanReleaseDate?.[0] ? unixToISO(po.koreanReleaseDate[0].timestamp) : null,
			spanish: {
				european: po.europeanSpanishReleaseDate?.[0]
					? unixToISO(po.europeanSpanishReleaseDate[0].timestamp)
					: null,
				latinAmerican: po.latinAmericanSpanishReleaseDate?.[0]
					? unixToISO(po.latinAmericanSpanishReleaseDate[0].timestamp)
					: null,
				primary: po.spanishReleaseDate?.[0] ? unixToISO(po.spanishReleaseDate[0].timestamp) : null,
			},
			portuguese: po.portugueseReleaseDate?.[0]
				? unixToISO(po.portugueseReleaseDate[0].timestamp)
				: null,
		},
		type: po.setType?.[0]?.fulltext,
	}
}

export default formatSetData
