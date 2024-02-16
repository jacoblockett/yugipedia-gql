import { Cluster } from "puppeteer-cluster"

const isObject = value => Object.prototype.toString.call(value) === "[object Object]"
const isPositiveNumber = value => typeof value === "number" && !isNaN(value) && value >= 0

class ClusterBrowser {
	/**
	 * @typedef {import("puppeteer").PuppeteerLaunchOptions} PuppeteerLaunchOptions
	 *
	 * @param {{
	 * 		concurrency: "CONCURRENCY_PAGE"|"CONCURRENCY_CONTEXT"|"CONCURRENCY_BROWSER"
	 * 		maxConcurrency: number
	 * 		puppeteerOptions: import("puppeteer").PuppeteerLaunchOptions
	 * 		retryLimit: number
	 * 		retryDelay: number
	 * 		skipDuplicateUrls: boolean
	 * 		timeout: number
	 * 		monitor: boolean
	 * }} options
	 */
	constructor(options) {
		if (!isObject(options)) options = {}
		if (
			!["CONCURRENCY_PAGE", "CONCURRENCY_CONTEXT", "CONCURRENCY_BROWSER"].includes(
				options.concurreny,
			)
		)
			options.concurreny = "CONCURRENCY_CONTEXT"
		if (!isPositiveNumber(options.maxConcurrency)) options.maxConcurrency = 1
		if (!isObject(options.puppeteerOptions)) options.puppeteerOptions = { headless: "new" }
		if (!isPositiveNumber(options.retryLimit)) options.retryLimit = 0
		if (!isPositiveNumber(options.retryDelay)) options.retryDelay = 0
		if (typeof options.skipDuplicateUrls !== "boolean") options.skipDuplicateUrls = true
		if (!isPositiveNumber(options.timeout)) options.timeout = 30000
		if (typeof options.monitor !== "boolean") options.monitor = false

		// explicitly setting in case any unknown options were passed through options object
		// https://www.npmjs.com/package/puppeteer-cluster#clusterlaunchoptions
		this.browserOptions = {
			concurreny: Cluster[options.concurreny],
			maxConcurrency: options.maxConcurrency,
			puppeteerOptions: options.puppeteerOptions,
			retryLimit: options.retryLimit,
			retryDelay: options.retryDelay,
			skipDuplicateUrls: options.skipDuplicateUrls,
			timeout: options.timeout,
			monitor: options.monitor,
		}
	}

	async #closeOnIdle(cluster) {
		await cluster.idle()
		await cluster.close()
	}

	async runTaskOnList(task, list) {
		const results = []
		const cluster = await Cluster.launch(this.browserOptions)

		try {
			await cluster.task(async ({ page, data, worker }) => {
				const result = await task(page, data, worker)

				results.push({ listItem: data, data: result, error: null })
			})
		} catch (error) {
			results.push({ listItem: data, data: null, error })
		}

		for (let i = 0; i < list.length; i++) {
			const listItem = list[i]

			cluster.queue(listItem)
		}

		await this.#closeOnIdle(cluster)

		return results
	}
}

export default ClusterBrowser
