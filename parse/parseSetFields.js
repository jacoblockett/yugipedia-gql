import graphqlFields from "graphql-fields"

const parseCardFields = info => {
	const fields = Object.entries(graphqlFields(info))
	const po = new Set(["Modification date", "Page name", "Page type"]) // po for PrintOuts

	for (let i = 0; i < fields.length; i++) {
		const [field, nested] = fields[i]

		if (field === "code") {
			if (nested.ean) po.add("EAN")
			if (nested.isbn) po.add("ISBN")
			if (nested.upc) po.add("UPC")
		}
		if (field === "coverCards") po.add("Cover card")
		if (field === "format") po.add("Format")
		if (field === "image") po.add("Set image")
		if (field === "konamiID") {
			if (nested.chinese?.simplified) po.add("Simplified Chinese database ID")
			if (nested.english?.asian) po.add("Asian-English database ID")
			if (nested.english?.earliest) po.add("English database ID")
			if (nested.french) po.add("French database ID")
			if (nested.german) po.add("German database ID")
			if (nested.italian) po.add("Italian database ID")
			if (nested.japanese) po.add("Japanese database ID")
			if (nested.korean) po.add("Korean database ID")
			if (nested.spanish) po.add("Spanish database ID")
			if (nested.portuguese) po.add("Portuguese database ID")
		}
		if (field === "mediums") po.add("Medium")
		if (field === "name") {
			if (nested.chinese?.primary?.hanzi) po.add("Chinese name")
			if (nested.chinese?.primary?.jyutping) po.add("Chinese Jyutping name")
			if (nested.chinese?.primary?.pinyin) po.add("Chinese Pinyin name")
			if (nested.chinese?.primary?.translated) po.add("Translated Chinese name")
			if (nested.chinese?.simplified?.hanzi) po.add("Simplified Chinese name")
			if (nested.chinese?.traditional?.hanzi) po.add("Traditional Chinese name")
			if (nested.english) po.add("English name")
			if (nested.french) po.add("French name")
			if (nested.german) po.add("German name")
			if (nested.italian) po.add("Italian name")
			if (
				nested.japanese?.html ||
				nested.japanese?.base ||
				nested.japanese?.annotation ||
				nested.japanese?.transposed ||
				nested.japanese?.adjacent
			)
				po.add("Japanese name")
			if (nested.japanese?.romaji?.annotation) po.add("Romaji name")
			if (nested.japanese?.translated?.annotation) po.add("Translated Japanese name")
			if (
				nested.korean?.html ||
				nested.korean?.base ||
				nested.korean?.annotation ||
				nested.korean?.transposed ||
				nested.korean?.adjacent
			)
				po.add("Korean name")
			if (nested.korean?.romanized) po.add("Korean Revised Romanization name")
			if (nested.korean?.translated) po.add("Translated Korean name")
			if (nested.portuguese) po.add("Portuguese name")
			if (nested.spanish) po.add("Spanish name")
		}
		if (field === "parent") po.add("Parent set")
		if (field === "prefix") {
			if (nested.chinese?.simplified) po.add("Simplified Chinese set prefix")
			if (nested.chinese?.traditional) po.add("Traditional Chinese set prefix")
			if (nested.english?.asian) po.add("Asian-English set prefix")
			if (nested.english?.earliest) po.add("English set prefix")
			if (nested.english?.european) po.add("European English set prefix")
			if (nested.english?.oceanic) po.add("Oceanic English set prefix")
			if (nested.french?.canadian) po.add("French-Canadian set prefix")
			if (nested.french?.local) po.add("French set prefix")
			if (nested.german) po.add("German set prefix")
			if (nested.italian) po.add("Italian set prefix")
			if (nested.japanese?.asian) po.add("Japanese-Asian set prefix")
			if (nested.japanese?.local) po.add("Japanese set prefix")
			if (nested.korean) po.add("Korean set prefix")
			if (nested.spanish) po.add("Spanish set prefix")
			if (nested.portuguese) po.add("Portuguese set prefix")
		}
		if (field === "promotionalSeries") po.add("Series")
		if (field === "regionalPrefix") {
			if (nested.chinese?.simplified) po.add("Simplified Chinese set and region prefix")
			if (nested.chinese?.traditional) po.add("Traditional Chinese set and region prefix")
			if (nested.english?.asian) po.add("Asian-English set and region prefix")
			if (nested.english?.earliest) po.add("English set and region prefix")
			if (nested.english?.european) po.add("European English set and region prefix")
			if (nested.english?.oceanic) po.add("Oceanic English set and region prefix")
			if (nested.french?.canadian) po.add("French-Canadian set and region prefix")
			if (nested.french?.local) po.add("French set and region prefix")
			if (nested.german) po.add("German set and region prefix")
			if (nested.italian) po.add("Italian set and region prefix")
			if (nested.japanese?.asian) po.add("Japanese-Asian set and region prefix")
			if (nested.japanese?.local) po.add("Japanese set and region prefix")
			if (nested.korean) po.add("Korean set and region prefix")
			if (nested.spanish) po.add("Spanish set and region prefix")
			if (nested.portuguese) po.add("Portuguese set and region prefix")
		}
		if (field === "releaseDate") {
			if (nested.chinese?.simplified) po.add("Simplified Chinese release date")
			if (nested.chinese?.traditional) po.add("Traditional Chinese release date")
			if (nested.english?.asian) po.add("Asian-English release date")
			if (nested.english?.earliest) po.add("English release date")
			if (nested.english?.en) po.add("English (EN) release date")
			if (nested.english?.european) po.add("European English release date")
			if (nested.english?.northAmerican) po.add("English (NA) release date")
			if (nested.english?.oceanic) po.add("Oceanic English release date")
			if (nested.english?.worldwide) po.add("Worldwide English release date")
			if (nested.french?.canadian) po.add("French-Canadian release date")
			if (nested.french?.primary) po.add("French release date")
			if (nested.german) po.add("German release date")
			if (nested.italian) po.add("Italian release date")
			if (nested.japanese?.asian) po.add("Japanese-Asian release date")
			if (nested.japanese?.primary) po.add("Japanese release date")
			if (nested.korean) po.add("Korean release date")
			if (nested.spanish?.european) po.add("European Spanish release date")
			if (nested.spanish?.latinAmerican) po.add("Latin American Spanish release date")
			if (nested.spanish?.primary) po.add("Spanish release date")
			if (nested.portuguese) po.add("Portuguese release date")
		}
		if (field === "type") po.add("Set type")
	}

	return [...po]
}

export default parseCardFields
