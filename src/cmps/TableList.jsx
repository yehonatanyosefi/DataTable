import { useState, useEffect, useCallback } from 'react'

export default function TableList({
	tableData,
	handleTableDataChange,
	handleColWidthChange,
	hiddenColumns,
	colWidths,
	setColWidths,
}) {
	const [rowData, setRowData] = useState([])
	const [dragging, setDragging] = useState({ columnId: null, startX: 0 })
	const [sortField, setSortField] = useState(null)
	const [sortOrder, setSortOrder] = useState(null) // 'asc' or 'desc'

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

	const handleInputChange = useCallback((e, rowId, columnId, type) => {
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
				handleTableDataChange({
					...tableData,
					data: newRowData,
				})
			}
			return newRowData
		})
	}, [])

	const handleSave = useCallback(() => {
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
	}, [dragging, colWidths, handleColWidthChange, setColWidths])

	useEffect(() => {
		setRowData(tableData.data)
	}, [tableData.data])

	const visibleColumns = tableData.columns.filter((column) => !hiddenColumns.includes(column.id))
	const gridTemplateColumns = visibleColumns
		.map((column) => `${colWidths[column.id] || '240'}px`)
		.join(' ')

	return (
		<>
			<TableGrid
				tableData={tableData}
				rowData={rowData}
				hiddenColumns={hiddenColumns}
				gridTemplateColumns={gridTemplateColumns}
				onMouseDown={handleMouseDown}
				onSortChange={handleSortChange}
				onInputChange={handleInputChange}
				onBlur={handleSave}
			/>
		</>
	)
}

function TableGrid({
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
									{column.type === 'boolean' ? (
										<input
											className="edit-input"
											type="checkbox"
											checked={row[column.id] || false}
											onChange={(e) => onInputChange(e, row.id, column.id, column.type)}
											onBlur={onBlur}
										/>
									) : (
										<input
											className="edit-input"
											type={column.type}
											value={row[column.id] || ''}
											onChange={(e) => onInputChange(e, row.id, column.id, column.type)}
											onBlur={onBlur}
											title={row[column.id] || ''}
										/>
									)}
								</div>
							))}
					</div>
				))}
		</div>
	)
}
