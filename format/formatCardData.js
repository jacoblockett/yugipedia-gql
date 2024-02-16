import camelCase from "lodash.camelcase"
import keysToCamelCase from "../utils/keysToCamelCase.js"
import properCase from "../utils/properCase.js"
import ruby from "../utils/ruby.js"
import cleanLinkedText from "../utils/cleanLinkedText.js"
import { MEDIA_ENDPOINT } from "../utils/constants.js"
import unixToISO from "../utils/unixToISO.js"

const formatCardData = async data => {
	// console.dir(data, { depth: null }) // for debugging
	const po = keysToCamelCase(data.printouts) // po, for PrintOuts

	const pageDetails = {
		redirectedFrom: data.rpno.from,
		name: data.rpno.to,
		type: po.pageType?.[0] && po.pageType[0].replace(/\s+page$/i, ""),
		url: data.fullurl ?? "",
		lastModified: po.modificationDate?.[0]?.timestamp
			? unixToISO(po.modificationDate[0].timestamp)
			: null,
	}

	if (!/card/i.test(po.pageType?.[0]))
		return {
			error: { code: 400, message: `Page <${data.fullurl}> is not a Card page` },
			page: pageDetails,
		}

	const attackActions = (po.attack ?? []).map(s => s.fulltext)
	const banishActions = (po.banishing ?? []).map(s => s.fulltext)
	const counterActions = (po.counters ?? []).map(s => s.fulltext)
	const lifepointActions = (po.lp ?? []).map(s => s.fulltext)
	const mstActions = (po.monsterSpellTrap ?? []).map(s => s.fulltext)
	const statActions = (po.stats ?? []).map(s => s.fulltext)
	const summoningActions = (po.summoning ?? []).map(s => s.fulltext)
	const allActions = [
		...attackActions,
		...banishActions,
		...counterActions,
		...lifepointActions,
		...mstActions,
		...statActions,
		...summoningActions,
	]

	const antiSupport = (po.antiSupport ?? []).map(s => s.fulltext)
	const antiArchetypeSupport = (po.archetypeAntiSupport ?? []).map(s => s.fulltext)
	const allAnti = [...antiSupport, ...antiArchetypeSupport]

	const requiredFusionMaterial = (po.fusionMaterial ?? []).map(s => s.fulltext)
	const requiredSynchroMaterial = (po.synchroMaterial ?? []).map(s => s.fulltext)
	const requiredRitualSpell = (po.ritualSpellCardRequired ?? []).map(s => s.fulltext)
	const fusionMaterialFor = (po.fusionMaterialFor ?? []).map(s => s.fulltext)
	const synchroMaterialFor = (po.synchroMaterialFor ?? []).map(s => s.fulltext)
	const ritualSpellFor = (po.ritualMonsterRequired ?? []).map(s => s.fulltext)
	const required = [...requiredFusionMaterial, ...requiredSynchroMaterial, ...requiredRitualSpell]
	const usedFor = [...fusionMaterialFor, ...synchroMaterialFor, ...ritualSpellFor]

	const support = (po.support ?? []).map(s => s.fulltext)
	const archetypeSupport = (po.archetypeSupport ?? []).map(s => s.fulltext)
	const allSupport = [...support, ...archetypeSupport]

	const direct = (po.archseries ?? []).map(s => s.fulltext)
	const indirect = (po.archseriesRelated ?? []).map(s => s.fulltext)
	const allFamily = [...direct, ...indirect]

	const monsterTypes = po.types?.[0] ? po.types[0].split(/\s+\/\s+/) : []
	const nonMonsterTypes = (po.propertyShort ?? []).map(s => cleanLinkedText(s))
	const types = [...monsterTypes, ...nonMonsterTypes]

	return {
		error: { code: 200, message: "OK" },
		actions: {
			all: allActions.length ? allActions : null,
			attack: attackActions.length ? attackActions : null,
			banish: banishActions.length ? banishActions : null,
			card: counterActions.length ? counterActions : null,
			counter: lifepointActions.length ? lifepointActions : null,
			lifepoint: mstActions.length ? mstActions : null,
			stat: statActions.length ? statActions : null,
			summoning: summoningActions.length ? summoningActions : null,
		},
		anti: {
			all: allAnti.length ? allAnti : null,
			support: antiSupport.length ? antiSupport : null,
			archetype: antiArchetypeSupport.length ? antiArchetypeSupport : null,
		},
		appearsIn: po.appearsIn?.[0] ? po.appearsIn.map(s => s.fulltext) : null,
		cardType: po.cardTypeShort?.[0] ? cleanLinkedText(po.cardTypeShort[0]) : "",
		charactersDepicted: po.character?.[0] ? po.character.map(s => s.fulltext) : null,
		debutDate: {
			main: po.debutDate?.[0] ? unixToISO(po.debutDate[0].timestamp) : null,
			ocg: po.ocgDebutDate?.[0] ? unixToISO(po.ocgDebutDate[0].timestamp) : null,
			tcg: po.tcgDebutDate?.[0] ? unixToISO(po.tcgDebutDate[0].timestamp) : null,
			tcgSpeedDuel: po.tcgSpeedDuelDebutDate?.[0]
				? unixToISO(po.tcgSpeedDuelDebutDate[0].timestamp)
				: null,
		},
		deckType: po.belongsTo?.[0] ? po.belongsTo[0].fulltext.replace(/\s+deck$/i, "") : null,
		description: {
			arabic: null,
			chinese: {
				simplified: {
					hanzi: po.simplifiedChineseLore?.[0]
						? cleanLinkedText(po.simplifiedChineseLore[0])
						: null,
					pinyin: null,
					translated: null,
				},
				traditional: {
					hanzi: po.traditionalChineseLore?.[0]
						? cleanLinkedText(po.traditionalChineseLore[0])
						: null,
					pinyin: null,
					translated: null,
				},
			},
			croatian: null,
			english: po.lore?.[0] ? cleanLinkedText(po.lore[0]) : null,
			french: po.frenchLore?.[0] ? cleanLinkedText(po.frenchLore[0]) : null,
			german: po.germanLore?.[0] ? cleanLinkedText(po.germanLore[0]) : null,
			greek: null,
			italian: po.italianLore?.[0] ? cleanLinkedText(po.italianLore[0]) : null,
			japanese: {
				...(po.japaneseLore?.[0] ? await ruby(cleanLinkedText(po.japaneseLore[0])) : {}),
				romaji: {
					base: null,
					annotation: null,
				},
				translated: {
					base: po.translatedJapaneseLore?.[0]
						? cleanLinkedText(po.translatedJapaneseLore[0])
						: null,
					annotation: null,
				},
			},
			korean: {
				...(po.koreanLore?.[0] ? await ruby(cleanLinkedText(po.koreanLore[0])) : {}),
				romanized: null,
			},
			portuguese: po.portugueseLore?.[0] ? cleanLinkedText(po.portugueseLore[0]) : null,
			spanish: po.spanishLore?.[0] ? cleanLinkedText(po.spanishLore[0]) : null,
		},
		effectTypes: po.effectType?.[0]
			? po.effectType.map(s => s.fulltext.replace(/\s+effect$/i, ""))
			: null,
		image: {
			artwork: po.cardArtwork?.[0] ? `${MEDIA_ENDPOINT}/${po.cardArtwork[0]}` : null,
			back: po.cardBackingImage?.[0]
				? `${MEDIA_ENDPOINT}/${po.cardBackingImage[0].fulltext}`
				: null,
			front: po.cardImage?.[0] ? `${MEDIA_ENDPOINT}/${po.cardImage[0]}` : null,
			name: po.cardImageName?.[0],
		},
		isReal: po.nonPhysicalCard?.[0]
			? po.nonPhysicalCard[0] === "true"
			: po.ocgStatus?.[0] ||
			  po.rushDuelStatus?.[0] ||
			  po.tcgStatus?.[0] ||
			  po.tcgSpeedDuelStatus?.[0] ||
			  po.tcgTraditionalFormatStatus?.[0]
			? true
			: false,
		konamiID: po.databaseId?.[0],
		limitation: po.limitationText?.[0],
		materials: {
			required: required.length ? required : null,
			usedFor: usedFor.length ? usedFor : null,
		},
		mediums: po.medium?.[0] ? po.medium : null,
		mentions: po.mentions?.[0] ? po.mentions.map(s => s.fulltext) : null,
		miscTags: po.misc?.[0] ? po.misc.map(s => s.fulltext) : null,
		name: {
			arabic: po.arabicName?.[0],
			chinese: {
				primary: {
					hanzi: po.chineseName?.[0],
					jyutping: po.chineseJyutpingName?.[0],
					pinyin: po.chinesePinyinName?.[0],
					translated: po.translatedChineseName?.[0],
				},
				simplified: {
					hanzi: po.simplifiedChineseName?.[0],
					pinyin: po.simplifiedChinesePinyinName?.[0]?.fulltext,
					translated: po.translatedSimplifiedChineseName?.[0]?.fulltext,
				},
				traditional: {
					hanzi: po.traditionalChineseName?.[0],
					pinyin: po.traditionalChinesePinyinName?.[0]?.fulltext,
					translated: null,
				},
			},
			croatian: po.croatianName?.[0],
			english: po.englishName?.[0],
			french: po.frenchName?.[0],
			german: po.germanName?.[0],
			greek: po.greekName?.[0],
			italian: po.italianName?.[0],
			japanese: {
				...(po.japaneseName?.[0] ? await ruby(po.japaneseName[0]) : {}),
				romaji: {
					base: po.baseRomajiName?.[0],
					annotation: po.romajiName?.[0],
				},
				translated: {
					base: po.translatedJapaneseBaseName?.[0],
					annotation: po.translatedJapaneseName?.[0],
				},
			},
			korean: {
				...(po.koreanName?.[0] ? await ruby(po.koreanName[0]) : {}),
				romanized: po.koreanRevisedRomanizationName?.[0],
			},
			portuguese: po.portugueseName?.[0],
			spanish: po.spanishName?.[0],
		},
		packCode: null,
		page: pageDetails,
		password: po.password?.[0],
		pendulum: {
			effect: {
				arabic: null,
				chinese: {
					simplified: {
						hanzi: po.simplifiedChinesePendulumEffect?.[0],
						pinyin: null,
						translated: null,
					},
					traditional: {
						hanzi: po.traditionalChinesePendulumEffect?.[0],
						pinyin: null,
						translated: null,
					},
				},
				croatian: null,
				english: po.pendulumEffect?.[0],
				french: po.frenchPendulumEffect?.[0],
				german: po.germanPendulumEffect?.[0],
				greek: null,
				italian: po.italianPendulumEffect?.[0],
				japanese: {
					...(po.japanesePendulumEffect?.[0]
						? await ruby(cleanLinkedText(po.japanesePendulumEffect[0]))
						: {}),
					romaji: {
						base: null,
						annotation: null,
					},
					translated: {
						base: po.translatedJapanesePendulumEffect?.[0]
							? cleanLinkedText(po.translatedJapanesePendulumEffect[0])
							: null,
						annotation: null,
					},
				},
				korean: {
					...(po.koreanPendulumEffect?.[0]
						? await ruby(cleanLinkedText(po.koreanPendulumEffect[0]))
						: {}),
					romanized: null,
				},
				portuguese: po.portuguesePendulumEffect?.[0],
				spanish: po.spanishPendulumEffect?.[0],
			},
			scale: po.pendulumScaleString?.[0],
		},
		pro: {
			all: allSupport.length ? allSupport : null,
			support: support.length ? support : null,
			archetype: archetypeSupport.length ? archetypeSupport : null,
		},
		rarity: null,
		related: {
			all: allFamily.length ? allFamily : null,
			direct: direct.length ? direct : null,
			indirect: indirect ? indirect : null,
		},
		releases: po.release?.[0] ? po.release.map(s => s.fulltext) : null,
		stats: {
			attack: po.atkString?.[0],
			attribute: po.attribute?.[0] ? properCase(po.attribute[0].fulltext) : null,
			defense: po.defString?.[0],
			level: po.levelString?.[0],
			link: {
				arrows: po.linkArrows?.[0] ? po.linkArrows : null,
				rating: po.linkRating?.[0],
			},
			rank: po.rankString?.[0],
			stars: po.starsString?.[0],
		},
		status: {
			ocg: po.ocgStatus?.[0] ? po.ocgStatus[0].fulltext : null,
			rushDuel: po.rushDuelStatus?.[0] ? po.rushDuelStatus[0].fulltext : null,
			tcg: po.tcgStatus?.[0] ? po.tcgStatus[0].fulltext : null,
			tcgSpeedDuel: po.tcgSpeedDuelStatus?.[0] ? po.tcgSpeedDuelStatus[0].fulltext : null,
			tcgTraditionalFormat: po.tcgTraditionalFormatStatus?.[0]
				? po.tcgTraditionalFormatStatus[0].fulltext
				: null,
		},
		summonedBy: po.summonedBy?.[0] ? po.summonedBy.map(s => s.fulltext) : null,
		types,
		usedBy: po.inDeck?.[0] ? po.inDeck.map(s => s.fulltext) : null,
	}
}

export default formatCardData
