import { useState, useEffect, useCallback } from 'react'
import TableList from '../cmps/TableList'
import AddDataForm from '../cmps/AddDataForm'
import ColumnVisibilityDropdown from '../cmps/ColumnVisibilityDropdown'
import { v4 as uuidv4 } from 'uuid'
import { tableService } from '../services/table.service.js'

const BoardDetails = () => {
	const [tableData, setTableData] = useState(null)
	const [isModalOpen, setModalOpen] = useState(false)
	const [hiddenColumns, setHiddenColumns] = useState([])
	const [colWidths, setColWidths] = useState({})

	useEffect(() => {
		const fetchTableData = async () => {
			const fetchedTableData = await tableService.query()
			setTableData(fetchedTableData[0])
			setColWidths(
				fetchedTableData[0].columns.reduce((acc, col) => ({ ...acc, [col.id]: col.width }), {})
			)
		}
		fetchTableData()
	}, [])

	const handleTableDataChange = async (newData) => {
		await tableService.put(newData)
		setTableData(newData)
	}

	const handleColWidthChange = (columnId, newWidth) => {
		setTableData((prevTableData) => {
			const newTableData = {
				...prevTableData,
				columns: prevTableData.columns.map((col) => {
					if (col.id === columnId) {
						return {
							...col,
							width: newWidth,
						}
					} else {
						return col
					}
				}),
			}
			handleTableDataChange(newTableData)
			return newTableData
		})
		setColWidths((prev) => ({ ...prev, [columnId]: newWidth }))
	}

	const handleToggleColumnVisibility = useCallback((columnId) => {
		setHiddenColumns((prevHiddenColumns) => {
			if (prevHiddenColumns.includes(columnId)) {
				return prevHiddenColumns.filter((id) => id !== columnId)
			} else {
				return [...prevHiddenColumns, columnId]
			}
		})
	}, [])

	const handleAddData = async (newData) => {
		const newEntry = { id: uuidv4(), ...newData }
		await tableService.post(newEntry)
		setTableData((prevTableData) => {
			const newTableData = {
				...prevTableData,
				data: [...prevTableData.data, newEntry],
			}
			return newTableData
		})
		setModalOpen(false)
	}

	if (!tableData) {
		return <div>Loading...</div>
	}

	return (
		<div className="board-details">
			<div className="table-header">
				<button className="add-data-btn" onClick={() => setModalOpen(true)}>
					Add Data
				</button>
				<ColumnVisibilityDropdown
					columns={tableData.columns}
					hiddenColumns={hiddenColumns}
					onToggleColumnVisibility={handleToggleColumnVisibility}
				/>
			</div>
			<TableList
				tableData={tableData}
				handleTableDataChange={handleTableDataChange}
				handleColWidthChange={handleColWidthChange}
				hiddenColumns={hiddenColumns}
				colWidths={colWidths}
				setColWidths={setColWidths}
			/>
			{isModalOpen && (
				<AddDataForm
					isOpen={isModalOpen}
					onRequestClose={() => setModalOpen(false)}
					columns={tableData.columns}
					onAddData={handleAddData}
				/>
			)}
		</div>
	)
}

export default BoardDetails
