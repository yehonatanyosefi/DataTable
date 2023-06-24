import { useState, useEffect } from 'react'
import { tableService } from '../../services/table.service.js'

const useFetchDataTable = (colWidths) => {
	const [tableData, setTableData] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchTableData = async () => {
			try {
				const fetchedTableData = await tableService.query()
				setTableData(fetchedTableData[0])
				colWidths.current = fetchedTableData[0].columns.reduce(
					(acc, col) => ({ ...acc, [col.id]: col.width }),
					{}
				)
			} catch (error) {
				setError('Error getting the table data, please refresh the page.')
			}
		}
		fetchTableData()
	}, [colWidths])

	const updateTableData = async (newData) => {
		try {
			await tableService.put(newData)
			setTableData(newData)
		} catch (err) {
			setError('Error saving the table data, please try again.')
		}
	}

	return { tableData, error, updateTableData, setError }
}
export default useFetchDataTable
