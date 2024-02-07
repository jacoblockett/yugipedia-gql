const getRequestedFields = info => {
	const fields = new Set()
	const selections = info.fieldNodes[0].selectionSet.selections

	selections.forEach(selection => {
		fields.add(selection.name.value)
	})

	return fields
}

export default getRequestedFields
