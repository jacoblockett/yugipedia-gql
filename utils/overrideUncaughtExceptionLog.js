const overrideUncaughtExceptionLog = () =>
	process.on("uncaughtException", (error, origin) => {
		console.error(error.message, "\n")
		console.dir(error.response, { depth: null })
	})

export default overrideUncaughtExceptionLog
