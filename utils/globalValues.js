import path from "path"

export default {
	cache: {
		path: path.resolve("./yugipedia-gql-cache"),
		ttl: { days: 30 },
	},
}
