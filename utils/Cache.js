import Database from "better-sqlite3"

const cache = new Database("cache")
cache.pragma("journal_mode = WAL")

export default cache

export function test() {
	console.log("testing cache export")
}
