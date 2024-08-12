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
			.replace(/[\n\r]+/g, "") || undefined
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
			.trim() || undefined
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
			.replace(/[\n\r]+/g, "") || undefined
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
			.replace(/[\n\r]+/g, "") || undefined

	return result
}

export default ruby
