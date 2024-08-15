import globalValues from "./utils/globalValues.js"
import { graphql, parse } from "graphql"
import schema from "./gql/schema.js"
import splitGQLQueries from "./utils/splitGQLQueries.js"
import errorStore, { clearErrors } from "./utils/errorStore.js"
import warningStore, { clearWarnings } from "./utils/warningStore.js"

class Yugipedia {
	/**
	 * Creates a Yugipedia API entity capable of performing basic operations.
	 *
	 * @link https://yugipedia.com/wiki/Yugipedia:API
	 *
	 * @param {{hydratePrototype: boolean, userAgent: {name: string, contact: string, reason?: string}}} options
	 * @param {boolean} [options.hydratePrototype] Whether to hydrate the prototype of the resulting data. Defaults to true.
	 * @param {string} options.userAgent.name The name of your service (personal name, online alias, business entity, whatever; just make sure it's something the api devs can use to id and address you appropriately if they have concerns)
	 * @param {string} options.userAgent.contact The best way contact you should the api devs have concerns
	 * @param {string} [options.userAgent.reason] The reason you're accessing the api. Defaults to `"Data Collection for Personal Use [Yugipedia-GQL]"`
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

		this.options = options
	}

	async query(gqlQueryString, variables) {
		if (typeof gqlQueryString !== "string")
			throw new TypeError(`Expected gqlQueryString to be a string`)

		const queryName = parse(gqlQueryString).definitions[0].name?.value ?? "query"

		if (queryName === "errors" || queryName === "warnings")
			throw new Error(`The name of your query cannot be "errors" or "warnings"`)

		const queries = splitGQLQueries(gqlQueryString)
		const results = { data: { [queryName]: {} }, errors: [], warnings: [] }

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
