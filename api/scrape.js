import ClusterBrowser from "../utils/ClusterBrowser.js"
import { WIKI_ENDPOINT } from "../utils/constants.js"
import limiter from "./limiter.js"

const browser = new ClusterBrowser({ retryLimit: 3, timeout: 8000 })

// need to bind the browser's 'this' object to the runTaskOnList function because
// wrapping it in the limiter santizes the 'this' object prior to running
const runTaskOnList = limiter.wrap(browser.runTaskOnList.bind(browser))

export const scrapeSetCardLists = async setName => {
	const lists = (
		await runTaskOnList(
			async (page, data) => {
				await page.setUserAgent(
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
				)
				await page.setViewport({ width: 1920, height: 1080 })
				await page.goto(`${WIKI_ENDPOINT}/${data}`, {
					waitUntil: "networkidle2",
				})

				const mainSelector = ".set-navigation .set-navigation__row dl"

				await page.waitForSelector(mainSelector)

				return await page.evaluate(async _ => {
					return Array.from(
						document.querySelectorAll(".set-lists-tabber .tabber .tabbertab"),
					).reduce((acc, node) => {
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
											}

											const link = node.querySelector("a")
											let item
											let notes

											if (link) {
												item = link.title

												if (/name/i.test(header)) {
													link.remove()
													notes = node.textContent.trim().substring(3).trim()

													if (!/[^\"]/.test(notes)) notes = ""
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
					}, {})
				})
			},
			[setName],
		)
	)[0].data

	return lists
}

// need to split columns based on br tags (i think)
