import axios from "axios"
import chalk from "chalk"
import { graphql, parse } from "graphql"
import schema from "./gql/schema.js"
import splitGQLQueries from "./utils/splitGQLQueries.js"
import sleep from "./utils/sleep.js"

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
	 */
	constructor(userAgent) {
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
	}

	async query(gqlQueryString, variables) {
		if (typeof gqlQueryString !== "string")
			throw new TypeError(`Expected gqlQueryString to be a string`)

		const queryName = parse(gqlQueryString).definitions[0].name?.value ?? "query"
		const queries = splitGQLQueries(gqlQueryString)
		const results = { [queryName]: {} }

		for (let i = 0; i < queries.length; i++) {
			const { name: resultName, query } = queries[i]

			const response = await graphql({
				schema,
				source: query,
				contextValue: this,
				variableValues: variables,
			})

			if (response.errors) {
				console.log(response.errors)
				results[queryName][resultName] = {
					error: {
						code: 500,
						message: JSON.stringify(response.errors),
					},
				}
			} else {
				results[queryName][resultName] = response.data[resultName]
			}
		}

		// Converting in and out of a JSON reinstitutes a prototype for the results object
		// as GQL creates objects with Object.create(null). Why do this? So when the results
		// are logged you don't have to see that ugly [Object: null prototype] bs. Return
		// results without hydrating if there're issues or bottlenecks.
		return JSON.parse(JSON.stringify(results))
	}

	// async semantic
}

export default Yugipedia
