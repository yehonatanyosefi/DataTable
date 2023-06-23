import { useState, useEffect, useCallback } from 'react'

export default function TableList({ tableData, handleTableDataChange, handleColWidthChange }) {
	const [rowData, setRowData] = useState([])
	const [colWidths, setColWidths] = useState(
		tableData.columns.reduce((acc, col) => ({ ...acc, [col.id]: col.width }), {})
	)
	const [hiddenColumns, setHiddenColumns] = useState([])
	const [dragging, setDragging] = useState({ columnId: null, startX: 0 })
	const [sortField, setSortField] = useState(null)
	const [sortOrder, setSortOrder] = useState(null) // 'asc' or 'desc'

	const handleToggleColumnVisibility = useCallback((columnId) => {
		setHiddenColumns((prevHiddenColumns) => {
			if (prevHiddenColumns.includes(columnId)) {
				return prevHiddenColumns.filter((id) => id !== columnId)
			} else {
				return [...prevHiddenColumns, columnId]
			}
		})
	}, [])

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

	const handleInputChange = useCallback((e, rowId, columnId) => {
		const value = e.target.value
		setRowData((prevState) => {
			return prevState.map((row) => {
				if (row.id === rowId) {
					return {
						...row,
						[columnId]: value,
					}
				} else {
					return row
				}
			})
		})
	}, [])

	const handleBlur = useCallback(() => {
		handleTableDataChange({
			...tableData,
			data: rowData,
		})
	}, [tableData, rowData, handleTableDataChange])

	useEffect(() => {
		let sortedData = [...tableData.data]
		if (sortField) {
			sortedData.sort((a, b) => {
				if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1
				if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1
				return 0
			})
		}
		setRowData(sortedData)
	}, [tableData.data, sortField, sortOrder])

	useEffect(() => {
		const handleMouseMove = (e) => {
			if (dragging.columnId) {
				const deltaX = e.pageX - dragging.startX
				const newWidth = Math.max(colWidths[dragging.columnId] + deltaX, 100)
				setColWidths((prev) => ({ ...prev, [dragging.columnId]: newWidth }))
				setDragging((prev) => ({ ...prev, startX: e.pageX }))
				handleColWidthChange(dragging.columnId, newWidth)
			}
		}

		const handleMouseUp = () => {
			setDragging({ columnId: null, startX: 0 })
		}

		document.body.addEventListener('mousemove', handleMouseMove)
		document.body.addEventListener('mouseup', handleMouseUp)
		return () => {
			document.body.removeEventListener('mousemove', handleMouseMove)
			document.body.removeEventListener('mouseup', handleMouseUp)
		}
	}, [dragging, colWidths, handleColWidthChange])

	useEffect(() => {
		setRowData(tableData.data)
	}, [tableData.data])

	const visibleColumns = tableData.columns.filter((column) => !hiddenColumns.includes(column.id))
	const gridTemplateColumns = visibleColumns
		.map((column) => `${colWidths[column.id] || '240'}px`)
		.join(' ')

	return (
		<>
			<ColumnVisibilityDropdown
				columns={tableData.columns}
				hiddenColumns={hiddenColumns}
				onToggleColumnVisibility={handleToggleColumnVisibility}
			/>
			<DataGrid
				tableData={tableData}
				rowData={rowData}
				hiddenColumns={hiddenColumns}
				gridTemplateColumns={gridTemplateColumns}
				onMouseDown={handleMouseDown}
				onSortChange={handleSortChange}
				onInputChange={handleInputChange}
				onBlur={handleBlur}
			/>
		</>
	)
}

function ColumnVisibilityDropdown({ columns, hiddenColumns, onToggleColumnVisibility }) {
	const [isOpen, setIsOpen] = useState(false)

	const toggleDropdown = () => setIsOpen(!isOpen)

	const toggleColumnVisibility = (columnId) => {
		onToggleColumnVisibility(columnId)
	}

	return (
		<div className={`dropdown ${isOpen ? 'open' : ''}`}>
			<button className="dropdown-btn" onClick={toggleDropdown}>
				Column Visibility
			</button>
			<div className="dropdown-content">
				{columns.map((column) => (
					<div
						key={column.id}
						className={`dropdown-item ${!hiddenColumns.includes(column.id) ? 'active' : ''}`}
						onClick={() => toggleColumnVisibility(column.id)}>
						{column.title}
					</div>
				))}
			</div>
		</div>
	)
}

function DataGrid({
	tableData,
	rowData,
	hiddenColumns,
	gridTemplateColumns,
	onMouseDown,
	onSortChange,
	onInputChange,
	onBlur,
}) {
	return (
		<div className="data-table">
			<div className="grid-header" style={{ gridTemplateColumns }}>
				{tableData.columns
					.filter((column) => !hiddenColumns.includes(column.id))
					.map((column) => (
						<div
							key={column.id}
							className="grid-cell"
							style={{ position: 'relative' }}
							onClick={() => onSortChange(column.id)}>
							{column.title}
							<div
								style={{
									position: 'absolute',
									top: 0,
									right: 0,
									bottom: 0,
									width: '5px',
									cursor: 'ew-resize',
								}}
								onMouseDown={(e) => onMouseDown(e, column.id)}></div>
						</div>
					))}
			</div>

			{rowData &&
				rowData.map((row) => (
					<div key={row.id} className="grid-row" style={{ gridTemplateColumns }}>
						{tableData.columns
							.filter((column) => !hiddenColumns.includes(column.id))
							.map((column) => (
								<div key={column.id} className="grid-cell">
									<input
										className="edit-input"
										type={column.type}
										value={row[column.id] || ''}
										onChange={(e) => onInputChange(e, row.id, column.id)}
										onBlur={onBlur}
										title={row[column.id] || ''}
									/>
								</div>
							))}
					</div>
				))}
		</div>
	)
}
