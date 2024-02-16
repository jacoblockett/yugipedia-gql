import axios from "axios"
import chalk from "chalk"
import { graphql, parse } from "graphql"
import schema from "./gql/schema.js"
import splitGQLQueries from "./utils/splitGQLQueries.js"
import sleep from "./utils/sleep.js"
import errorStore, { clearErrors } from "./utils/errorStore.js"
import warningStore from "./utils/warningStore.js"

class Yugipedia {
	/**
	 * Creates a Yugipedia API entity capable of performing basic operations.
	 *
	 * @link https://yugipedia.com/wiki/Yugipedia:API
	 *
	 * @param {{name: string, contact: string, reason?: string}} userAgent User-Agent details for the api devs to track/contact you by in case concerns are risen. Subvert at risk of being temp/perma-banned without recourse.
	 * @param {string} userAgent.name The name of your service (personal name, online alias, business entity, whatever; just make sure it's something the api devs can use to id and address you appropriately if they have concerns)
	 * @param {string} userAgent.contact The best way contact you should the api devs have concerns
	 * @param {string} [userAgent.reason] The reason you're accessing the api. Defaults to `"Data Collection for Personal Use"`
	 *
	 * @param {{hydratePrototype: boolean}} options
	 * @param {boolean} [options.hydratePrototype] Weather to hydrate the prototype of the resulting data. Defaults to true.
	 */
	constructor(userAgent, options) {
		if (Object.prototype.toString.call(userAgent) !== "[object Object]")
			throw new TypeError(`Expected userAgent to be an object`)

		if (typeof userAgent.name !== "string" || userAgent.name.length < 1)
			throw new TypeError(`Expected userAgent.name to be a non-empty string`)
		if (typeof userAgent.contact !== "string" || userAgent.contact.length < 1)
			throw new TypeError(`Expected userAgent.contact to be a non-empty string`)

		if (userAgent.reason === void 0) userAgent.reason = "Data Collection for Personal Use"
		if (typeof userAgent.reason !== "string" || userAgent.reason.length < 1)
			throw new TypeError(`Expected userAgent.reason to be a non-empty string`)

		this.userAgent = `name/${userAgent.name} contact/${userAgent.contact} reason/${userAgent.reason} node.js/${process.version} axios/^1.6.7`

		if (Object.prototype.toString.call(options) !== "[object Object]") options = {}

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
			const contextValue = { userAgent: this.userAgent }
			const response = await graphql({
				schema,
				source,
				contextValue,
				variableValues: variables,
			})

			if (response.errors) {
				for (let i = 0; i < response.errors.length; i++) {
					const error = response.errors[i]
					results.errors.push({ name: resultName, code: 500, log: error })
				}
			}
			if (errorStore.length) {
				for (let i = 0; i < errorStore.length; i++) {
					const { code, log } = errorStore[i]
					results.errors.push({ name: resultName, code, log })
				}

				clearErrors()
			}
			if (warningStore.length) {
				for (let i = 0; i < warningStore.length; i++) {
					const { code, log } = warningStore[i]
					results.warnings.push({ name: resultName, code, log })
				}

				clearWarnings()
			}

			if (!response?.data?.[resultName]) {
				results.warnings.push({ name: resultName, code: 500, log: `Query produced no data.` })
				results.data[queryName][resultName] = {}
				continue
			}

			results.data[queryName][resultName] = this.options.hydratePrototype
				? JSON.parse(JSON.stringify(response.data[resultName]))
				: response.data[resultName]
		}

		return results
	}
}

export default Yugipedia
