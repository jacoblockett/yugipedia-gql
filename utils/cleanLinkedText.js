import cheerio from "cheerio"
// import elmara from "elmara"

const cleanLinkedText = description => {
	if (typeof description !== "string") throw new TypeError(`Expected description to be a string`)

	const $ = cheerio.load(description)

	$("body").find("br").replaceWith("\n")

	return $("body")
		.text()
		.split(/\n/)
		.map(s => s.replace(/\[\[(?:[^\]\]]+\|)?(.*?)\]\]/g, "$1").replace(/^(?:'')(.+)(?:'')$/, "$1"))
		.join("|||")
		.trim()
		.replace(/^(?:'')(.+)(?:'')$/, "$1")
		.replace(/\|\|\|/g, "\n")
}

// EXAMPLE TO CLEAN:
// const ex =
// 		"''The hero who defends the [[LIGHT|light]] of the stars<br />" +
// 		"Must destroy the [[DARK|darkness]] of the illusory world<br />" +
// 		"And entrust his [[ATK|power]] to the chosen one.<br />" +
// 		"The will inherited by the chalice of the stars will become a new key<br />" +
// 		"And become the sword that cuts down darkness.''"

export default cleanLinkedText
