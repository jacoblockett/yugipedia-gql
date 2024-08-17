import globalValues from "./utils/globalValues.js"
import { graphql, parse } from "graphql"
import schema from "./gql/schema.js"
import splitGQLQueries from "./utils/splitGQLQueries.js"
import errorStore, { clearErrors } from "./utils/errorStore.js"
import warningStore, { clearWarnings } from "./utils/warningStore.js"
import path from "path"
import { createCache, purgeExpiredData } from "./utils/cache.js"

class Yugipedia {
	/**
	 * Creates a Yugipedia API entity capable of performing basic operations.
	 *
	 * @link https://yugipedia.com/wiki/Yugipedia:API
	 *
	 * @param {{hydratePrototype: boolean, userAgent: {name: string, contact: string, reason?: string}, cache?: {path?: string, ttl?: {years?: number, months?: number, days?: number, hours?: number, minutes?: number, seconds?: number}}|false}}} options
	 * @param {boolean} [options.hydratePrototype] Whether to hydrate the prototype of the resulting data. Defaults to `true`.
	 * @param {string} options.userAgent.name The name of your service (personal name, online alias, business entity, whatever; just make sure it's something the api devs can use to id and address you appropriately if they have concerns)
	 * @param {string} options.userAgent.contact The best way contact you should the api devs have concerns
	 * @param {string} [options.userAgent.reason] The reason you're accessing the api. Defaults to `"Data Collection for Personal Use [Yugipedia-GQL]"`
	 * @param {{path?: string, ttl?: {years?: number, months?: number, days?: number, hours?: number, minutes?: number, seconds?: number}}|false} [options.cache] The cache settings object. Set to false if you don't want caching
	 * @param {string} [options.cache.path] The path to the cache file. Defaults to `{cwd}/yugipedia-gql-cache`
	 * @param {{years?: number, months?: number, days?: number, hours?: number, minutes?: number, seconds?: number}} [options.cache.ttl] The time-to-live for each cache entry. Defaults to `{days: 30}`
	 */
	constructor(options) {
		if (Object.prototype.toString.call(options) !== "[object Object]") options = {}

		if (Object.prototype.toString.call(options.userAgent) !== "[object Object]")
			throw new TypeError(`Expected options.userAgent to be an object`)

		if (typeof options.userAgent.name !== "string" || options.userAgent.name.length < 1)
			throw new TypeError(`Expected options.userAgent.name to be a non-empty string`)
		if (typeof options.userAgent.contact !== "string" || options.userAgent.contact.length < 1)
			throw new TypeError(`Expected options.userAgent.contact to be a non-empty string`)

		if (options.userAgent.reason === undefined)
			options.userAgent.reason = "Data Collection for Personal Use [Yugipedia-GQL]"
		if (typeof options.userAgent.reason !== "string" || options.userAgent.reason.length < 1)
			throw new TypeError(`Expected options.userAgent.reason to be a non-empty string`)

		globalValues.userAgent = `name/${options.userAgent.name} contact/${options.userAgent.contact} reason/${options.userAgent.reason} node.js/${process.version} axios/v1.7.3`

		if (typeof options.hydratePrototype !== "boolean") options.hydratePrototype = true

		if (options.cache === false) {
			globalValues.cache = false
		} else {
			if (typeof options?.cache?.path === "string")
				globalValues.cache.path = path.resolve(options.cache.path)
			if (Object.prototype.toString.call(options?.cache?.ttl) === "[object Object]")
				globalValues.cache.ttl = {
					years: options.cache.ttl.years || 0,
					months: options.cache.ttl.months || 0,
					days: options.cache.ttl.days || 0,
					hours: options.cache.ttl.hours || 0,
					minutes: options.cache.ttl.minutes || 0,
					seconds: options.cache.ttl.seconds || 0,
				}
			if (Object.values(globalValues.cache.ttl).reduce((a, b) => a + b, 0) === 0)
				globalValues.cache.ttl = { days: 30 }
		}

		this.options = options
	}

	/**
	 * Performs a query against the Yugipedia API with the given GraphQL query string and variables.
	 *
	 * @param {string} gqlQueryString The GraphQL query string
	 * @param {{[key]: unknown}} variables The variables to use with the query
	 *
	 * @returns {{data: {[key]: unknown}, errors: null|[{culprit: string, code: number, log: {message: string, payload: unknown}}], warnings: null|[{culprit: string, code: number, log: {message: string, payload: unknown}}]}}
	 */
	async query(gqlQueryString, variables) {
		if (typeof gqlQueryString !== "string")
			throw new TypeError(`Expected gqlQueryString to be a string`)

		const queryName = parse(gqlQueryString).definitions[0].name?.value ?? "query"

		if (queryName === "errors" || queryName === "warnings")
			throw new Error(`The name of your query cannot be "errors" or "warnings"`)

		const queries = splitGQLQueries(gqlQueryString)
		const results = { data: { [queryName]: {} }, errors: [], warnings: [] }

		if (globalValues.cache) {
			createCache()
			purgeExpiredData()
		}

		for (let i = 0; i < queries.length; i++) {
			const { name: resultName, query: source } = queries[i]
			const response = await graphql({
				schema,
				source,
				variableValues: variables,
			})

			if (response.errors) {
				for (let i = 0; i < response.errors.length; i++) {
					const error = response.errors[i]
					results.errors.push({
						culprit: resultName,
						code: 500,
						log: { message: `A GQL error occurred.`, payload: error },
					})
				}
			}
			if (errorStore.length) {
				for (let i = 0; i < errorStore.length; i++) {
					const { code, log } = errorStore[i]
					results.errors.push({ culprit: resultName, code, log })
				}

				clearErrors()
			}
			if (warningStore.length) {
				for (let i = 0; i < warningStore.length; i++) {
					const { code, log } = warningStore[i]
					results.warnings.push({ culprit: resultName, code, log })
				}

				clearWarnings()
			}

			if (!response?.data?.[resultName]) {
				results.data[queryName][resultName] = {}
				continue
			}

			results.data[queryName][resultName] = this.options.hydratePrototype
				? JSON.parse(JSON.stringify(response.data[resultName]))
				: response.data[resultName]
		}

		if (!results.errors.length) results.errors = null
		if (!results.warnings.length) results.warnings = null

		return results
	}
}

export default Yugipedia
