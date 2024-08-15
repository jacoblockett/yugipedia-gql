import Database from "better-sqlite3"
import FatalError from "./FatalError.js"
import isStringArray from "./isStringArray.js"
import { add } from "date-fns"

const cache = new Database("cache")
cache.pragma("journal_mode = WAL")

cache.exec(`
	CREATE TABLE IF NOT EXISTS redirects (
		[from] TEXT NOT NULL,
		[to] TEXT NOT NULL,
		expiration BIGINT
	);

	CREATE INDEX IF NOT EXISTS idx_redirects_from ON redirects ([from]);

	CREATE TABLE IF NOT EXISTS keytraces (
		keytrace TEXT NOT NULL,
		expiration BIGINT
	);

	CREATE INDEX IF NOT EXISTS idx_key_trace ON keytraces (keytrace);
`)

export default cache

const statements = {
	insert: {
		redirect: cache.prepare("INSERT INTO redirects ([from], [to], expiration) VALUES (?, ?, ?)"),
		keyTrace: cache.prepare("INSERT INTO keytraces (keytrace, expiration) VALUES (?, ?)"),
	},
	find: {
		redirect: cache.prepare("SELECT * FROM redirects WHERE [from] = ?"),
		keyTrace: cache.prepare("SELECT * FROM keytraces WHERE keytrace = ?"),
	},
	delete: {
		redirect: cache.prepare("DELETE FROM redirects WHERE [from] = ?"),
		keyTrace: cache.prepare("DELETE FROM keytraces WHERE keytrace = ?"),
	},
}

const insertRedirect = (from, to) =>
	statements.insert.redirect.run(from, to, add(Date.now(), { days: 30 }).getTime())
const insertKeyTrace = keytrace =>
	statements.insert.keyTrace.run(keytrace, add(Date.now(), { days: 30 }).getTime())
const findRedirectFromVariants = variants => {
	if (!isStringArray(variants)) FatalError(`Expected variants to be an array of strings`, variants)

	for (const variant of variants) {
		const foundRedirect = statements.find.redirect.get(variant)

		if (foundRedirect) {
			if (foundRedirect.expiration > Date.now()) {
				return foundRedirect
			} else {
				statements.delete.redirect.run(variant)
			}
		}
	}
}
const findKeyTrace = keyTrace => {
	if (typeof keyTrace !== "string") FatalError(`Expected keyTrace to be a string`, keyTrace)

	const foundKeyTrace = statements.find.keyTrace.get(keyTrace)

	if (foundKeyTrace) {
		if (foundKeyTrace.expiration > Date.now()) {
			return foundKeyTrace
		} else {
			statements.delete.keyTrace.run(keyTrace)
		}
	}
}

export { insertRedirect, insertKeyTrace, findKeyTrace, findRedirectFromVariants }
