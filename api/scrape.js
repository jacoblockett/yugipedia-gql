import findRedirects from "../queries/findRedirects.js"
import ClusterBrowser from "../utils/ClusterBrowser.js"
import FatalError from "../utils/FatalError.js"
import { INDEX_ENDPOINT, WIKI_ENDPOINT } from "../utils/constants.js"
import { addError } from "../utils/errorStore.js"
import { addWarning } from "../utils/warningStore.js"
import limiter from "./limiter.js"

const browser = new ClusterBrowser({ retryLimit: 3 })

// need to bind the browser's 'this' object to the runTaskOnList function because
// wrapping it in the limiter santizes the 'this' object prior to running
const runTaskOnList = limiter.wrap(browser.runTaskOnList.bind(browser))
const createURL = title => `${INDEX_ENDPOINT}?title=${title}&mobileaction=toggle_view_desktop`

export const scrapeSetCardLists = async (setName, languages) => {
	if (typeof setName !== "string") FatalError(`Expected setName to be a string`)

	setName = (await findRedirects([setName]))?.[0]?.to

	const lists = await runTaskOnList(
		async (page, { setName, languages }) => {
			await page.setUserAgent(
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
			)
			await page.setViewport({ width: 1920, height: 1080 })

			const mainURL = createURL(setName)

			await page.goto(mainURL, { waitUntil: "networkidle2" })
			await page.waitForSelector(".set-navigation .set-navigation__row dl")
			await page.waitForSelector(".set-lists-tabber .tabber .tabbertab")

			const setNavigation = await page.evaluate(async _ => {
				return Array.from(
					document.querySelectorAll(".set-navigation > .set-navigation__row.hlist dl"),
				).reduce((acc, node) => {
					const title = node.querySelector("dt").textContent
					const items = Array.from(node.querySelectorAll("dd a")).reduce((acc, node) => {
						const text = node.textContent
						const linkTitle = node.title

						return { ...acc, [text]: linkTitle }
					}, {})

					return { ...acc, [title]: items }
				}, {})
			})

			const cardListScrapeFx = async _ => {
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
			}

			const cardListData = await page.evaluate(cardListScrapeFx)

			// if a requested language does not exist, or if it has empty data, attempt to find
			// the list through the manual link

			const missing = []

			const manualCardListScrapeFx = async _ => {
				return Array.from(document.querySelectorAll(".set-list")).reduce((acc, node) => {
					const headers = Array.from(node.querySelectorAll("table thead > tr th"), header =>
						header.textContent
							.trim()
							.split(/[^a-zA-Z0-9]+/)
							.map((w, i) =>
								i < 1 ? w.toLowerCase() : `${w[0].toUpperCase()}${w.substring(1).toLowerCase()}`,
							)
							.join(""),
					)
					const rows = Array.from(node.querySelectorAll("table tbody tr")).reduce((acc, node) => {
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
					}, [])

					return [...acc, ...rows]
				}, [])
			}

			for (let i = 0; i < languages.length; i++) {
				const language = languages[i]
				const alreadyFound = cardListData[language]

				if (!Array.isArray(alreadyFound)) {
					addWarning({ code: 301, log: `"${language}" is not available for this set.` })
					continue
				}

				if (!alreadyFound.length) {
					const manualLink = setNavigation.Lists[language]

					if (!manualLink) {
						addWarning({ code: 301, log: `"${language}" is not available for this set.` })
						continue
					}

					const secondaryURL = createURL(manualLink)

					await page.goto(secondaryURL, { waitUntil: "networkidle2" })
					await page.waitForSelector(".set-list")

					const newCardListData = await page.evaluate(manualCardListScrapeFx)

					if (!newCardListData.length) {
						addWarning({ code: 301, log: `"${language}" is not available for this set.` })
						continue
					}

					cardListData[language] = newCardListData
				}
			}

			return cardListData
		},
		[{ setName, languages }],
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
