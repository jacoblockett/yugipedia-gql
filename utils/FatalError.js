import overrideUncaughtExceptionLog from "./overrideUncaughtExceptionLog.js"

const FatalError = (message, data) => {
	overrideUncaughtExceptionLog()

	const stackTrace = new Error().stack.replace("Error\n", "")

	console.error(`FatalError: ${message}`)
	console.error(stackTrace)
	console.log("\n")
	console.dir(data, { depth: null })

	process.exit(1)
}

export default FatalError
