import Database from "better-sqlite3"
import FatalError from "./FatalError.js"
import isStringArray from "./isStringArray.js"
import { add } from "date-fns"
import v8 from "v8"

// create a purge function that runs at the start of the query, rather than checking on
// each individual lookup

const cache = new Database("cache")
cache.pragma("journal_mode = WAL")

cache
	.prepare(
		`CREATE TABLE IF NOT EXISTS redirects (
			[from] TEXT NOT NULL,
			[to] TEXT NOT NULL,
			expiration BIGINT
		);`
	)
	.run()
cache
	.prepare(
		`CREATE TABLE IF NOT EXISTS printouts (
			pageName TEXT NOT NULL,
			printout TEXT NOT NULL,
			payload TEXT,
			expiration BIGINT
		);`
	)
	.run()
cache.prepare(`CREATE INDEX IF NOT EXISTS idx_redirects_from ON redirects ([from]);`).run()
cache.prepare(`CREATE INDEX IF NOT EXISTS idx_printouts_pageName ON printouts (pageName);`).run()
cache.prepare(`CREATE INDEX IF NOT EXISTS idx_printouts_printout ON printouts (printout);`).run()

export default cache

const statements = {
	insert: {
		redirect: cache.prepare("INSERT INTO redirects ([from], [to], expiration) VALUES (?, ?, ?)"),
		printout: cache.prepare(
			"INSERT INTO printouts (pageName, printout, payload, expiration) VALUES (?, ?, ?, ?)"
		),
	},
	find: {
		redirect: cache.prepare("SELECT * FROM redirects WHERE [from] = ?"),
		printout: cache.prepare(
			"SELECT payload, expiration FROM printouts WHERE pageName = ? AND printout = ?"
		),
		printouts: cache.prepare("SELECT * FROM printouts WHERE pageName = ?"),
	},
	delete: {
		redirect: cache.prepare("DELETE FROM redirects WHERE [from] = ?"),
		printout: cache.prepare("DELETE FROM printouts WHERE pageName = ? AND printout = ?"),
	},
}

export const insertRedirect = (from, to) => {
	statements.delete.redirect.run(from)
	statements.insert.redirect.run(from, to, add(Date.now(), { days: 30 }).getTime())
}
export const insertPrintout = (pageName, printout, payload) => {
	statements.delete.printout.run(pageName, printout)
	statements.insert.printout.run(
		pageName,
		printout,
		JSON.stringify(payload),
		add(Date.now(), { days: 30 }).getTime()
	)
}
export const findRedirectFromVariants = variants => {
	if (!isStringArray(variants)) FatalError(`Expected variants to be an array of strings`, variants)

	for (const variant of variants) {
		const foundRedirect = statements.find.redirect.get(variant)

		if (foundRedirect) {
			return foundRedirect
		}
	}
}
export const findPrintout = (pageName, printout) => {
	if (typeof pageName !== "string") FatalError(`Expected pageName to be a string`, pageName)
	if (typeof printout !== "string") FatalError(`Expected printout to be a string`, printout)

	const found = statements.find.printout.get(pageName, printout)

	if (found) {
		found.payload = JSON.parse(found.payload)

		return found
	}
}
export const findPrintouts = pageName => {
	if (typeof pageName !== "string") FatalError(`Expected pageName to be a string`, pageName)

	return statements.find.printouts
		.all(pageName)
		.map(x => ({ ...x, payload: JSON.parse(x.payload) }))
}
