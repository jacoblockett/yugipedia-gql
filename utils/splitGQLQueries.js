import { parse, print, visit } from "graphql"

// this is some magic thanks to https://stackoverflow.com/a/59850337/8429492
// and the usedVariables stuff is magic thanks to chatGPT
// long live ast so long as it doesn't ever talk to me again

const splitGQLQueries = query => {
	const ast = parse(query)
	const def = ast.definitions[0]
	const selections = def.selectionSet.selections

	return selections.map(selection => {
		const usedVariables = new Set()

		visit(selection, {
			Variable(node) {
				usedVariables.add(node.name.value)
			},
		})

		const rootVariableDefinitions = def.variableDefinitions.filter(vdef =>
			usedVariables.has(vdef.variable.name.value),
		)

		let name
		if (selection.alias) {
			name = selection.alias.value
		} else {
			name = selection.name.value
		}

		return {
			name,
			query: print({
				...ast,
				definitions: [
					{
						...def,
						variableDefinitions: rootVariableDefinitions,
						selectionSet: { ...def.selectionSet, selections: [selection] },
					},
				],
			}),
		}
	})
}

export default splitGQLQueries
