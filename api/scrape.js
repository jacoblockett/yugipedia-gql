import ClusterBrowser from "../utils/ClusterBrowser.js"
import { WIKI_ENDPOINT } from "../utils/constants.js"
import limiter from "./limiter.js"

const browser = new ClusterBrowser({ retryLimit: 3, timeout: 8000 })

// need to bind the browser's 'this' object to the runTaskOnList function because
// wrapping it in the limiter santizes the 'this' object prior to running
const runTaskOnList = limiter.wrap(browser.runTaskOnList.bind(browser))

export const scrapeSetCardLists = async (setName, userAgent) => {
	const lists = (
		await runTaskOnList(
			async (page, data) => {
				await page.setUserAgent(userAgent)
				await page.goto(`${WIKI_ENDPOINT}/${data}`)
				await page.setViewport({ width: 1920, height: 1080 })

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
							const rows = Array.from(node.querySelectorAll("table tbody tr"), node => {
								const items = Array.from(node.querySelectorAll("td")).reduce(
									(acc, node, columnNumber) => {
										const header = headers[columnNumber]
										const link = node.querySelector("a")
										let item
										let notes

										if (link) {
											item = link.title

											if (/name/i.test(header)) {
												link.remove()
												notes = node.textContent.trim()
												notes = notes.substring(3, notes.length - 1).trim()

												if (!/[^\"]/.test(notes)) notes = ""
											}
										} else {
											item = node.textContent
										}

										return { ...acc, [header]: item, ...(notes ? { notes } : {}) }
									},
									{},
								)

								return items
							})

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
