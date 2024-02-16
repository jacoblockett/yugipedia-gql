import ClusterBrowser from "../utils/ClusterBrowser.js"
import { INDEX_ENDPOINT, WIKI_ENDPOINT } from "../utils/constants.js"
import { addError } from "../utils/errorStore.js"
import limiter from "./limiter.js"

const browser = new ClusterBrowser({ retryLimit: 3 })

// need to bind the browser's 'this' object to the runTaskOnList function because
// wrapping it in the limiter santizes the 'this' object prior to running
const runTaskOnList = limiter.wrap(browser.runTaskOnList.bind(browser))

export const scrapeSetCardLists = async setName => {
	const lists = await runTaskOnList(
		async (page, data) => {
			await page.setUserAgent(
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
			)
			await page.setViewport({ width: 1920, height: 1080 })

			const url = `${INDEX_ENDPOINT}?title=${data}&mobileaction=toggle_view_desktop`

			await page.goto(url, { waitUntil: "networkidle2" })
			await page.waitForSelector(".set-navigation .set-navigation__row dl")

			const cardListData = await page.evaluate(async _ => {
				return Array.from(document.querySelectorAll(".set-lists-tabber .tabber .tabbertab")).reduce(
					(acc, node) => {
						const language = node.title
						const list = Array.from(node.querySelectorAll(".set-list")).reduce((acc, node) => {
							const headers = Array.from(node.querySelectorAll("table thead > tr th"), header =>
								header.textContent
									.trim()
									.split(/[^a-zA-Z0-9]+/)
									.map((w, i) =>
										i < 1
											? w.toLowerCase()
											: `${w[0].toUpperCase()}${w.substring(1).toLowerCase()}`,
									)
									.join(""),
							)
							const rows = Array.from(node.querySelectorAll("table tbody tr")).reduce(
								(acc, node) => {
									const cells = Array.from(node.querySelectorAll("td")).reduce(
										(acc, node, columnNumber) => {
											const header = headers[columnNumber]

											const link = node.querySelector("a")
											let item
											let notes

											if (header === "rarity") {
												const rarities = Array.from(node.childNodes)
													.reduce(
														(acc, child) => {
															if (child.nodeName === "BR") {
																acc.push([])
															} else if (child.nodeName === "A") {
																acc[acc.length - 1].push(child.title)
															} else {
																acc[acc.length - 1].push(child.textContent)
															}

															return acc
														},
														[[]],
													)
													.flat(3)

												return { ...acc, rarities }
											} else if (header === "category") {
												const text = node.textContent

												return { ...acc, category: text }
											} else if (/name/i.test(header)) {
												if (link) {
													item = link.title
													link.remove()
													notes = node.textContent.trim().substring(3).trim()

													if (!/[^\"]/.test(notes)) notes = ""
												} else {
													const text = node.textContent

													item = text.substring(1, text.length - 1)
												}
											} else {
												item = node.textContent
											}

											return { ...acc, [header]: item, ...(notes ? { notes } : {}) }
										},
										{},
									)
									const { rarities, ...rest } = cells
									const split = Array.from({ length: rarities.length }, (_, i) => ({
										...rest,
										rarity: rarities[i],
									}))

									return [...acc, ...split]
								},
								[],
							)

							return [...acc, ...rows]
						}, [])

						return { ...acc, [language]: list }
					},
					{},
				)
			})

			return cardListData
		},
		[setName],
	)

	if (lists?.[0]?.error) {
		addError({
			code: 402,
			log: { message: `An error forced the scraping process to fail.`, payload: lists[0].error },
		})

		return {}
	}

	if (!lists?.[0]?.data) {
		addError({
			code: 404,
			log: {
				message: `Something unexpected happened and no data was found after scraping the link ${INDEX_ENDPOINT}?title=${setName}&mobileaction=toggle_view_desktop`,
			},
		})

		return {}
	}

	return lists[0].data
}

// TODO: fix category data scrape - lds2-en124 is effect xyz monster with two sep links, so only effect monster is recorded
