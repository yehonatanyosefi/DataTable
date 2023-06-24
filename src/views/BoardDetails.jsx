import { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react'

import TableList from '../cmps/TableList'
import TableHeader from '../cmps/TableHeader'

import { v4 as uuidv4 } from 'uuid'
import { tableService } from '../services/table.service.js'

import useThrottle from '../customHooks/useThrottle'
import useFetchDataTable from '../customHooks/table/useFetchDataTable'
const AddDataForm = lazy(() => import('../cmps/tableHeader/AddDataForm'))

const PAGE_SIZE = 10
//TODO: switch to fetching limited data from server, and saving only the limited data if we get a backend

const BoardDetails = () => {
	const [isModalOpen, setModalOpen] = useState(false)
	const [hiddenColumns, setHiddenColumns] = useState([])
	const [page, setPage] = useState(1)
	const [rowData, setRowData] = useState([])
	const [sortField, setSortField] = useState(null)
	const [sortOrder, setSortOrder] = useState(null) // 'asc' or 'desc'

	const dragging = useRef({ columnId: null, startX: 0 })
	const colWidths = useRef({})

	const { tableData, updateTableData, error, setError } = useFetchDataTable(colWidths)

	const handleColWidthChange = useCallback(
		(columnId, newWidth) => {
			updateTableData((prevTableData) => {
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
				updateTableData(newTableData)
				return newTableData
			})
			colWidths.current = { ...colWidths.current, [columnId]: newWidth }
		},
		[updateTableData]
	)

	const handleDeleteRow = (rowId) => {
		updateTableData((prevTableData) => {
			const newTableData = {
				...prevTableData,
				data: prevTableData.data.filter((row) => row.id !== rowId),
			}
			updateTableData(newTableData)
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
		updateTableData((prevTableData) => {
			const newTableData = {
				...prevTableData,
				data: [newEntry, ...prevTableData.data],
			}
			updateTableData(newTableData)
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
		dragging.current = { columnId, startX: e.pageX }
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
					updateTableData({
						...tableData,
						data: newRowData,
					})
				}
				return newRowData
			})
		},
		[updateTableData, tableData]
	)

	const handleSaveRow = useCallback(() => {
		updateTableData({
			...tableData,
			data: rowData,
		})
	}, [tableData, rowData, updateTableData])

	const visibleColumns = tableData?.columns.filter((column) => !hiddenColumns.includes(column.id))
	const gridTemplateColumns = useMemo(() => {
		return visibleColumns?.map((column) => `${colWidths.current[column.id] || '240'}px`).join(' ')
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
		if (dragging.current.columnId) {
			const deltaX = e.pageX - dragging.current.startX
			const newWidth = Math.max(colWidths.current[dragging.current.columnId] + deltaX, 100)

			colWidths.current = { ...colWidths.current, [dragging.current.columnId]: newWidth }
			dragging.current = { ...dragging.current, startX: e.pageX }
			handleColWidthChange(dragging.current.columnId, newWidth)
		}
	}, 100)

	useEffect(() => {
		const handleMouseUp = () => {
			dragging.current = { columnId: null, startX: 0 }
		}

		document.body.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
		return () => {
			document.body.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [dragging, colWidths, handleColWidthChange, handleMouseMove])

	useEffect(() => {
		if (!tableData?.data) return
		setRowData(tableData.data)
	}, [tableData?.data])

	useEffect(() => {
		const fetchTableData = async () => {
			try {
				const fetchedTableData = await tableService.query()
				updateTableData(fetchedTableData[0])
				colWidths.current = fetchedTableData[0].columns.reduce(
					(acc, col) => ({ ...acc, [col.id]: col.width }),
					{}
				)
			} catch (error) {
				setError('Error getting the table data, please refresh the page.')
			}
		}
		fetchTableData()
	}, [setError, updateTableData])

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
				<Suspense fallback={<div>Loading...</div>}>
					<AddDataForm
						isOpen={isModalOpen}
						onRequestClose={() => setModalOpen(false)}
						columns={tableData.columns}
						onAddData={handleAddData}
					/>
				</Suspense>
			)}
		</div>
	)
}

export default BoardDetails
