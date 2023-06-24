import { useState, useEffect, useCallback, useMemo } from 'react'

import TableList from '../cmps/TableList'
import TableHeader from '../cmps/TableHeader'
import AddDataForm from '../cmps/tableHeader/AddDataForm'

import { v4 as uuidv4 } from 'uuid'
import { tableService } from '../services/table.service.js'
import useThrottle from '../customHooks/useThrottle'

const PAGE_SIZE = 10
//TODO: switch to fetching limited data from server, and saving only the limited data if we get a backend

const BoardDetails = () => {
	const [tableData, setTableData] = useState(null)
	const [isModalOpen, setModalOpen] = useState(false)
	const [hiddenColumns, setHiddenColumns] = useState([])
	const [colWidths, setColWidths] = useState({})
	const [error, setError] = useState(null)
	const [page, setPage] = useState(1)

	const [rowData, setRowData] = useState([])
	const [dragging, setDragging] = useState({ columnId: null, startX: 0 })
	const [sortField, setSortField] = useState(null)
	const [sortOrder, setSortOrder] = useState(null) // 'asc' or 'desc'

	const handleSaveData = async (newData) => {
		try {
			await tableService.put(newData)
		} catch (err) {
			setError('Error saving the table data, please try again.')
		}
	}

	const handleTableDataChange = async (newData) => {
		handleSaveData(newData)
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
			handleSaveData(newTableData)
			return newTableData
		})
		setColWidths((prev) => ({ ...prev, [columnId]: newWidth }))
	}

	const handleDeleteRow = (rowId) => {
		setTableData((prevTableData) => {
			const newTableData = {
				...prevTableData,
				data: prevTableData.data.filter((row) => row.id !== rowId),
			}
			handleSaveData(newTableData)
			return newTableData
		})
		// Adjust the current page if the last row of the page was deleted
		if ((page - 1) * PAGE_SIZE >= rowData.length - 1) {
			setPage(Math.max(1, page - 1))
		}
	}

	const handlePageChange = useCallback((newPage) => {
		setPage(newPage)
	}, [])

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
		setTableData((prevTableData) => {
			const newTableData = {
				...prevTableData,
				data: [newEntry, ...prevTableData.data],
			}
			handleTableDataChange(newTableData)
			return newTableData
		})
		setModalOpen(false)
	}

	const handleSortChange = useCallback(
		(columnId) => {
			if (sortField === columnId) {
				// If already sorted by this field, toggle the order
				setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
			} else {
				// Otherwise, sort by this field in ascending order
				setSortField(columnId)
				setSortOrder('asc')
			}
		},
		[sortField, sortOrder]
	)

	const handleMouseDown = useCallback((e, columnId) => {
		e.stopPropagation()
		setDragging({ columnId, startX: e.pageX })
	}, [])

	const handleInputChange = useCallback(
		(e, rowId, columnId, type) => {
			const value = type === 'boolean' ? e.target.checked : e.target.value
			setRowData((prevState) => {
				const newRowData = prevState.map((row) => {
					if (row.id === rowId) {
						return {
							...row,
							[columnId]: value,
						}
					} else {
						return row
					}
				})
				if (type === 'boolean') {
					handleSaveData({
						...tableData,
						data: newRowData,
					})
				}
				return newRowData
			})
		},
		[handleSaveData, tableData]
	)

	const handleSaveRow = useCallback(() => {
		handleTableDataChange({
			...tableData,
			data: rowData,
		})
	}, [tableData, rowData, handleTableDataChange])

	const visibleColumns = tableData?.columns.filter((column) => !hiddenColumns.includes(column.id))
	const gridTemplateColumns = useMemo(() => {
		return visibleColumns?.map((column) => `${colWidths[column.id] || '240'}px`).join(' ')
	}, [visibleColumns, colWidths])
	const paginatedData = rowData?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

	useEffect(() => {
		if (!tableData?.data) return
		let sortedData = [...tableData.data]
		if (sortField) {
			sortedData.sort((a, b) => {
				if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1
				if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1
				return 0
			})
		}
		setRowData(sortedData)
	}, [tableData?.data, sortField, sortOrder])

	const handleMouseMove = useThrottle((e) => {
		if (dragging.columnId) {
			const deltaX = e.pageX - dragging.startX
			const newWidth = Math.max(colWidths[dragging.columnId] + deltaX, 100)
			setColWidths((prev) => ({ ...prev, [dragging.columnId]: newWidth }))
			setDragging((prev) => ({ ...prev, startX: e.pageX }))
			handleColWidthChange(dragging.columnId, newWidth)
		}
	}, 100)

	useEffect(() => {
		const handleMouseUp = () => {
			setDragging({ columnId: null, startX: 0 })
		}

		document.body.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
		return () => {
			document.body.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [dragging, colWidths, handleColWidthChange, setColWidths])

	useEffect(() => {
		if (!tableData?.data) return
		setRowData(tableData.data)
	}, [tableData?.data])

	useEffect(() => {
		const fetchTableData = async () => {
			try {
				const fetchedTableData = await tableService.query()
				setTableData(fetchedTableData[0])
				setColWidths(
					fetchedTableData[0].columns.reduce((acc, col) => ({ ...acc, [col.id]: col.width }), {})
				)
			} catch (error) {
				setError('Error getting the table data, please refresh the page.')
			}
		}
		fetchTableData()
	}, [])

	if (error) {
		return <div className="board-details">{error && <div className="error">{error}</div>}</div>
	} else if (!tableData) {
		return (
			<div className="board-details">
				<div>Loading...</div>
			</div>
		)
	}

	return (
		<div className="board-details">
			{error && (
				<div className="error" role="alert">
					{error}
				</div>
			)}
			<TableHeader
				columns={tableData.columns}
				hiddenColumns={hiddenColumns}
				onToggleColumnVisibility={handleToggleColumnVisibility}
				handleModalChange={() => setModalOpen(true)}
			/>
			<TableList
				tableData={tableData}
				hiddenColumns={hiddenColumns}
				page={page}
				totalPages={Math.ceil(rowData.length / PAGE_SIZE)}
				paginatedData={paginatedData}
				rowData={rowData}
				gridTemplateColumns={gridTemplateColumns}
				sortField={sortField}
				sortOrder={sortOrder}
				onRowDataChange={handleSaveRow}
				onDeleteRow={handleDeleteRow}
				onPageChange={handlePageChange}
				onSortChange={handleSortChange}
				onMouseDown={handleMouseDown}
				onInputChange={handleInputChange}
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
