import overrideUncaughtExceptionLog from "./overrideUncaughtExceptionLog.js"

const QueryError = responseObject => {
	overrideUncaughtExceptionLog()

	throw {
		message: `QueryError: There was an error processing your request.`,
		response: responseObject,
	}
}

export default QueryError
