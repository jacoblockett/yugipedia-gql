import elmara from "elmara"

const ruby = async html => {
	const tree = await elmara(html)
	const result = {}

	result.html = html
	result.base =
		tree.children
			.map(leaf => {
				if (leaf.name === "ruby") {
					return leaf.select("rb").text.join("")
				} else {
					return leaf.text
				}
			})
			.join("")
			.replace(/[\n\r]+/g, "") || void 0
	result.annotation =
		tree.children
			.map(leaf => {
				if (leaf.name === "ruby") {
					return leaf.select("rt").text.join("")
				} else {
					return leaf.text.replace(/[^\s]/g, "")
				}
			})
			.filter(s => s)
			.join("")
			.replace(/[\n\r]+/g, "")
			.trim() || void 0
	result.transposed =
		tree.children
			.map(leaf => {
				if (leaf.name === "ruby") {
					return leaf.select("rt").text.join("")
				} else {
					return leaf.text
				}
			})
			.join("")
			.replace(/[\n\r]+/g, "") || void 0
	result.adjacent =
		tree.children
			.map(leaf => {
				if (leaf.name === "ruby") {
					return `${leaf.select("rb").text.join("")}(${leaf.select("rt").text.join("")})`
				} else {
					return leaf.text
				}
			})
			.join("")
			.replace(/[\n\r]+/g, "") || void 0

	return result
}

export default ruby
